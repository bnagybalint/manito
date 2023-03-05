import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers'

import DatePicker from './DatePicker';

describe('DatePicker', () => {

    it('should display date', () => {
        const label = "Test Picker";
        const date = moment("2023-02-21");

        render(
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"en"}>
                <DatePicker label={label} value={date}/>
            </LocalizationProvider>,
        );

        expect(screen.getByLabelText(label)).toBeInTheDocument();
        expect(screen.getByLabelText(label)).toHaveDisplayValue("02/21/2023");
    })

    it.each([
        [{dateStr: "2023-02-21", locale: "en"}, "02/21/2023"],
        [{dateStr: "2023-02-21", locale: "es"}, "21/02/2023"],
        [{dateStr: "2023-02-21", locale: "hu-hu"}, "2023.02.21."],
    ])('should display date in the correct locale (%p)', ({dateStr, locale}: { dateStr: string, locale: string}, result: string) => {
        const label = "Test Picker";
        const date = moment(dateStr);

        render(
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
                <DatePicker label={label} value={date}/>
            </LocalizationProvider>,
        );

        expect(screen.getByLabelText(label)).toBeInTheDocument();
        expect(screen.getByLabelText(label)).toHaveDisplayValue(result);
    })

});

