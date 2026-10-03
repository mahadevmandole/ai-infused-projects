import { SectionHeading } from "../atoms";
import { ModelBattleWorkspace } from "../organisms";

export function ModelBattleTemplate() {
  return (
    <section className="grid gap-5">
      <SectionHeading
        description="Prompt two models side by side, compare their responses, and vote for the stronger answer."
        eyebrow="Compare models"
        title="Model Battle"
      />
      <ModelBattleWorkspace />
    </section>
  );
}
