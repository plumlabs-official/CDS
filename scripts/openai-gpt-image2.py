#!/usr/bin/env python3
"""Small local helper for OpenAI GPT Image 2.

The script intentionally never persists the API key. It reads the key from
OPENAI_API_KEY by default, or from the macOS clipboard with --key-source
clipboard for one-off local runs.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path


API_BASE = "https://api.openai.com/v1"


def load_api_key(source: str) -> str:
    if source == "env":
        key = os.environ.get("OPENAI_API_KEY", "").strip()
    elif source == "clipboard":
        key = subprocess.check_output(["pbpaste"], text=True).strip()
    else:
        raise ValueError(f"Unsupported key source: {source}")

    if not key:
        raise RuntimeError(f"No API key found in {source}")
    return key


def request_json(method: str, path: str, key: str, payload: dict | None = None) -> dict:
    body = None
    headers = {"Authorization": f"Bearer {key}"}
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(
        f"{API_BASE}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"OpenAI API error {exc.code}: {detail}") from exc


def list_image_models(key: str) -> None:
    payload = request_json("GET", "/models", key)
    ids = sorted(
        model.get("id", "")
        for model in payload.get("data", [])
        if "image" in model.get("id", "").lower() or "dall-e" in model.get("id", "").lower()
    )
    print(json.dumps({"ok": True, "image_models": ids}, ensure_ascii=False, indent=2))


def check_model(key: str, model: str) -> None:
    payload = request_json("GET", f"/models/{model}", key)
    print(
        json.dumps(
            {
                "ok": True,
                "model": payload.get("id", model),
                "owned_by": payload.get("owned_by"),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def generate_image(args: argparse.Namespace, key: str) -> None:
    if not args.prompt:
        raise RuntimeError("--prompt is required when generating an image")

    payload = {
        "model": args.model,
        "prompt": args.prompt,
        "size": args.size,
        "n": 1,
    }
    if args.quality:
        payload["quality"] = args.quality
    if args.background:
        payload["background"] = args.background
    if args.output_format:
        payload["output_format"] = args.output_format

    response = request_json("POST", "/images/generations", key, payload)
    data = response.get("data") or []
    if not data:
        raise RuntimeError("Image generation response did not contain data")

    item = data[0]
    out = Path(args.output).expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    if item.get("b64_json"):
        out.write_bytes(base64.b64decode(item["b64_json"]))
    elif item.get("url"):
        with urllib.request.urlopen(item["url"], timeout=120) as image_response:
            out.write_bytes(image_response.read())
    else:
        raise RuntimeError("Image generation response had neither b64_json nor url")

    print(
        json.dumps(
            {
                "ok": True,
                "model": args.model,
                "output": str(out),
                "revised_prompt_present": bool(item.get("revised_prompt")),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="OpenAI GPT Image 2 local helper")
    parser.add_argument("--key-source", choices=["env", "clipboard"], default="env")
    parser.add_argument("--model", default="gpt-image-2")
    parser.add_argument("--list-image-models", action="store_true")
    parser.add_argument("--check-model", action="store_true")
    parser.add_argument("--prompt")
    parser.add_argument("--output", default="exports/openai-gpt-image2/output.png")
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--quality")
    parser.add_argument("--background")
    parser.add_argument("--output-format")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        key = load_api_key(args.key_source)
        if args.list_image_models:
            list_image_models(key)
        elif args.check_model:
            check_model(key, args.model)
        else:
            generate_image(args, key)
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
