# I30 Adaptive Business Previews

## Goal
Transform each typed idea into a visibly different interactive app concept based on the business itself, rather than reusing one generic dashboard.

## Approved behavior
The typed idea is the source of truth for app name, business domain, visual archetype, navigation, metrics, actions, content and vivid theme. Watch, eyewear, mechanic, restaurant, running, real estate, social media and other ideas must feel native to their domain. Two ideas should not merely differ by copy/color: layout/archetype should vary deterministically from the idea.

## Architecture
Keep generation deterministic and client-side. `creator/app-model.js` owns idea analysis and returns a structured model. `creator/ui.js` renders that model safely into multiple visual archetypes. Known domains get rich domain semantics; unknown domains derive useful labels from keywords instead of falling back to `Meu App`. Themes use vivid gradients and deterministic variation. No arbitrary generated JavaScript is executed.

## Model
`buildAppModel(idea)` returns `{name, domain, archetype, theme, tabs, stats, actions, items, hero}`. Domain presets provide semantic vocabulary; a deterministic seed selects compatible layout/theme variants so repeated rendering is stable while different ideas vary.

## UX
Preview remains mobile-first and interactive. Archetypes include dashboard, catalog/storefront and activity/service. Product businesses emphasize visual product cards/categories; service businesses emphasize operational actions/status; activity products emphasize progress and live metrics. CTA continues to `@aureon_saas` after the preview.

## Constraints
This remains a front-end concept preview, not a published production app. Preserve history, project tab, Instagram CTA and PWA behavior. Avoid generic `Meu App` output.