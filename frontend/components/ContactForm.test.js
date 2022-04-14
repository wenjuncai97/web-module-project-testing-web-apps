import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />);

    const headerElement = screen.queryByText(/Contact Form/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name*/i);

    userEvent.type(firstNameInput, "nate");

    const errorMessages = await screen.findAllByTestId("error")
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)

    const submitBtn = screen.getByRole('button', {name: /submit/i})
    
    userEvent.click(submitBtn);


    // await waitFor(() => {
    //     const errorMessages = screen.queryAllByTestId("error")
    //     expect(errorMessages).toHaveLength(3);
    // })
    // can use waitFor or async

    const errorMessages = await screen.findAllByTestId("error")
    expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name*/i)
    userEvent.type(firstNameInput, "Nathan");
    
    const lastNameInput = screen.getByLabelText(/last name*/i)
    userEvent.type(lastNameInput, "Cai");

    const submitBtn = screen.getByRole('button', {name: /submit/i})
    
    userEvent.click(submitBtn);

    const errorMessages = await screen.findAllByTestId("error")
    expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email*/i)
    userEvent.type(emailInput, "Nathan@gmail");

    const errorMessage = await screen.findByText(/email must be a valid email address/i)
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name*/i)
    userEvent.type(firstNameInput, "Nathan")
    expect(firstNameInput).toHaveValue("Nathan")

    const emailInput = screen.getByLabelText(/email*/i)
    userEvent.type(emailInput, "nathan97cai@gmail.com");
    expect(emailInput).toHaveValue("nathan97cai@gmail.com")

    const submitBtn = screen.getByRole('button')
    userEvent.click(submitBtn);

    const errorMessage = await screen.findByText(/lastName is a required field/i)
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "Nathan");

    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "Cai");

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "nate97@gmail.com");

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText(/nathan/i);
        const lastNameDisplay = screen.queryByText(/cai/i);
        const emailDisplay = screen.queryByText(/nate97@gmail.com/i);
        const messageDisplay = screen.queryByTestId(/messageDisplay/i);

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "Nathan");

    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "Cai");

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "nate97@gmail.com");

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    const messageField = screen.getByLabelText(/message/i);
    userEvent.type(messageField, "Message");

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText(/nathan/i);
        const lastNameDisplay = screen.queryByText(/cai/i);
        const emailDisplay = screen.queryByText(/nate97@gmail.com/i);
        const messageDisplay = screen.queryByTestId(/message/i);

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});
