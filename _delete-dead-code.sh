#!/usr/bin/env bash
# Delete dead components superseded by the v2 rework (0 imports in built code).
# Run from the repo root:  bash _delete-dead-code.sh
set -e
cd "$(dirname "$0")"

# Intro/brand components — all replaced by Navigation.tsx (BrandLockup + useIntroGate)
rm -f "src/components/modules/IntroSequence.tsx"
rm -f "src/components/modules/CornerMark.tsx"
rm -f "src/components/modules/SonicVisual.tsx"

# Old splash hero — "/" now redirects to /home, so this is unused
rm -f "src/components/modules/HomeHero.tsx"

echo "Deleted dead components."
