import { ScreenOnboarding } from "./screens/ScreenOnboarding";

export default function App() {
  return (
    <ScreenOnboarding
      totalPages={5}
      onStart={() => console.log("Start clicked")}
      onInvite={() => console.log("Invite clicked")}
      onExistingUser={() => console.log("Existing user clicked")}
    />
  );
}
