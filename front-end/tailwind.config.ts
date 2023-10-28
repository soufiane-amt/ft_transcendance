import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/page.tsx',
    './src/components/HomePage/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/2fa/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/updatecredentials/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/Structure.tsx',
    './src/app/game/page.tsx',
    './src/components/game/GameLandingPage.tsx',
    './src/components/game/InfoModel.tsx',
    './src/components/game/InviteFriendsModel.tsx',
    './src/components/game/GameSettingsModel.tsx',
    './src/components/GlobalComponents/GameInvitation.tsx',
    './src/components/game/MatchMakingAnimation.tsx'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],

  corePlugins: {
    preflight: false,
  }
}
export default config


