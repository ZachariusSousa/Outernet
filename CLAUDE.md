# OuterNet - guide for Claude

A network of small language models on people's own PCs that study, play, and help each other answer queries. Sidestep from the Murmur research repo (`C:\Murmur`), which stays the lab and results frontend.

**Start with `docs/design.md`** (idea, principles, milestones, open questions).

## Working rules (carried over from Murmur)
- Friendly, plain, concise. Zach likes to settle concepts before writing lots of code.
- Never use the owner's private files for training or libraries.
- Write baselines and kill criteria before running experiments; keep failures in the numbers; one seed and a few hundred items by default.
- Treat run outputs as evidence; don't delete them.
- Only commit when asked. Log meaningful work in a dated progress note under `docs/`.
