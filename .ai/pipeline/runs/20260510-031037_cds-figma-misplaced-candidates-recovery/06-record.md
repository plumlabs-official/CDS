# Record

## TL;DR

- 종합: 목표는 `CDS 후보 컴포넌트를 올바른 CDS 원본 파일로 옮기고, 2026-05 사용처는 CDS 인스턴스를 쓰도록 고치며, Slack 업무 리포트 미발송 문제도 함께 해결하는 것`입니다. 오케스트레이터는 일을 `증거 확인 -> 계획/리뷰 -> CDS 원본 복구 -> 오버라이드 보존 검사 -> publish 확인 -> 사용처 교체 -> 잘못 만든 local 후보 정리 -> Slack 리포트 버그 수정`으로 나누어 진행했습니다. Figma 작업은 Codex가 Figma MCP로 CDS 원본 28개를 만들고, 사용자가 publish한 뒤 2026-05 대상 화면의 29개 사용처를 published CDS remote 인스턴스로 교체했습니다. `사람 태그`처럼 문구가 다른 사용처는 상태별 CDS 원본을 따로 써서 화면 의미가 사라지지 않게 처리했습니다. Slack 문제는 오케스트레이터 스크립트와 회귀 테스트를 고쳐, 미발송을 발송 완료로 착각하지 않고 최종 리포트도 실제 TL;DR을 쓰도록 했습니다. 결과는 `성공`입니다.

## Result

- CDS source creation: done.
- Recovery components in CDS: 28 total.
  - 27 generic recovered source components.
  - 1 state-specific source component for `Feed Compose Option Row / 사람 태그`.
- Usage-file replacement: done, 29/29 instances now point to published CDS remote component keys.
- Local misplaced candidate cleanup: done, 27 unreferenced local candidate originals and empty `Codex CDS Candidates` frame removed.
- Slack report bug fix: done and tested.
- Slack 업무 리포트: initial blocked report was sent when publish was waiting; final completion report is generated from this record.

## Pass Gates

- R1 inventory: PASS, 27 local candidate originals and 29 usage instances found.
- R2 CDS source recovery: PASS, 28/28 CDS source components have image fills, no slash names, and `ContractException` descriptions.
- R6 visual override check: PASS with one planned exception, `28502:43` mapped to state-specific CDS source.
- Publish gate: PASS after user completed publish; 28/28 CDS component keys import in the usage file.
- Use-site replacement gate: PASS, 29/29 expected target instances are remote CDS instances and inside page `14332:285690`.
- Cleanup gate: PASS for this run's misplaced local candidates; 8 referenced `/ CANDIDATE` nodes remain on separate page `15236:199` and were not touched.
- Slack gate: PASS, skipped delivery no longer marks the final report as sent; retry path is covered by tests.
- Report gate: PASS, final completion report is generated from this record.

## Next Action

별도 조치는 필요 없습니다. 다만 남아 있는 다른 페이지 `15236:199`의 `/ CANDIDATE` 노드 8개는 이번 범위 밖이고 실제 참조가 있으므로, 별도 정리 작업으로 다루는 것이 안전합니다.

## Artifacts

- Run directory: `/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery`
- CDS component map: `cds-recovery-component-map.json`
- State component map: `cds-state-component-map.json`
- Override risk report: `override-risk.json`
- Product swap postflight: `product-swap-postflight.json`
- Publish dispatch result from the earlier blocked attempt: `.goal-publish-cds-desktop-control-result.json`
