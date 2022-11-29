import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
    }

    interface Palette {
        red: Palette['primary'];
        green: Palette['primary'];
        blue: Palette['primary'];
        bg: Palette['primary'];
        backdrop: Palette['primary'];
        positive: Palette['primary'];
        negative: Palette['primary'];
    }
    interface PaletteOptions {
        red: PaletteOptions['primary'];
        green: PaletteOptions['primary'];
        blue: PaletteOptions['primary'];
        bg: PaletteOptions['primary'];
        backdrop: PaletteOptions['primary'];
        positive: PaletteOptions['primary'];
        negative: PaletteOptions['primary'];
    }
}

interface ManitoOverrides {
    red: true;
    green: true;
    blue: true;
    bg: true;
    backdrop: true;
    positive: true;
    negative: true;
}

// Updating component props
declare module '@mui/material/Fab' {
    interface FabPropsColorOverrides extends ManitoOverrides {}
}
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides extends ManitoOverrides {}
}

declare module '@mui/material/ToggleButton' {
    interface ToggleButtonPropsColorOverrides extends ManitoOverrides {}
}

declare module '@mui/material/TextField' {
    interface TextFieldPropsColorOverrides extends ManitoOverrides {}
}


const manitoLightTheme = createTheme(
    {
        palette: {
            primary: {
                main: '#5da271',
                light: '#8dd4a0',
                dark: '#2e7345',
                contrastText: '#ffffff'
            },
            secondary: {
                main: '#7b5e7b',
                light: '#aa8baa',
                dark: '#4e344f',
                contrastText: '#ffffff'
            },
            red: {
                main: '#ca3835',
                light: '#ff6b5f',
                dark: '#92000e',
                contrastText: '#ffffff',
            },
            green: {
                main: '#5da271',
                light: '#8dd4a0',
                dark: '#2e7345',
                contrastText: '#ffffff'
            },
            blue: {
                main: '#5da271',
                light: '#8dd4a0',
                dark: '#2e7345',
                contrastText: '#ffffff'
            },
            backdrop: {
                main: '#e7e7e7',
                light: '#ff6b5f',
                dark: '#b5b5b5',
                contrastText: '#000000',
            },
            bg: {
                main: '#ffffff',
                light: '#ffffff',
                dark: '#ffffff',
                contrastText: '#000000',
            },
            positive: {
                main: '#00a000',
                contrastText: '#ffffff'
            },
            negative: {
                main: '#f00000',
                contrastText: '#ffffff'
            },
        },
        typography: {
            fontSize: 12,
        }
    }
);

export default class ThemeFactory {
    static createLightTheme() {
        return manitoLightTheme;
    }
};
