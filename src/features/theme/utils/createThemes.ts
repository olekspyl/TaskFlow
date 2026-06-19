import plugin from 'tailwindcss/plugin'

type ThemeColors = Record<string, string>
type Themes = {
  light: ThemeColors
  dark: ThemeColors
}

export function createThemes(themes: Themes) {
  const allColorNames = [...new Set([...Object.keys(themes.light), ...Object.keys(themes.dark)])]

  return plugin(
    ({ addBase, addUtilities }) => {
      const lightVars: Record<string, string> = {}
      const darkVars: Record<string, string> = {}

      Object.entries(themes.light).forEach(([key, value]) => {
        lightVars[`--color-${key}`] = value
      })

      Object.entries(themes.dark).forEach(([key, value]) => {
        darkVars[`--color-${key}`] = value
      })

      addBase({
        ':root': lightVars,
        '.dark': darkVars,
      })

      const utilities: Record<string, Record<string, string>> = {}

      allColorNames.forEach((colorName) => {
        const cssVar = `var(--color-${colorName})`

        utilities[`.text-${colorName}`] = {
          color: cssVar,
        }

        utilities[`.bg-${colorName}`] = {
          backgroundColor: cssVar,
        }

        utilities[`.border-${colorName}`] = {
          borderColor: cssVar,
        }

        utilities[`.ring-${colorName}`] = {
          '--tw-ring-color': cssVar,
        }

        utilities[`.fill-${colorName}`] = {
          fill: cssVar,
        }

        utilities[`.stroke-${colorName}`] = {
          stroke: cssVar,
        }
      })

      addUtilities(utilities)
    },
    {
      theme: {
        extend: {
          colors: Object.fromEntries(
            allColorNames.map((colorName) => [colorName, `var(--color-${colorName})`]),
          ),
        },
      },
    },
  )
}
