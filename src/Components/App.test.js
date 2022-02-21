import React from 'react';
import {mount, shallow} from 'enzyme';
import App from './App';
import {render, screen} from "@testing-library/react";

jest.mock('react-router-dom', () => ({
    __esModule: true,
    useLocation: jest.fn().mockReturnValue({
        pathname: '/another-route',
        search: '',
        hash: '',
        state: null,
        key: '5nvxpbdafa',
    }),
}));

jest.mock('./App', () => ({
    __esModule: true, // this property makes it work
    default: 'mockedDefaultExport',
    namedExport: jest.fn(),
}));

describe('<App/> test effect hooks', () => {
    const app = render(<App/>);


    it('gets indicators', async () => {
        /*expect(
            app.find('groupSets'),
        ).toEqual({});

         */
        //const linkElement = screen.getByText(/learn react/i);
        //expect(linkElement).toBeInTheDocument();
    });

})
