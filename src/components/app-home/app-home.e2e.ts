import { newE2EPage } from '@stencil/core/testing';
import 'stencil-timepicker';
import 'stencil-datepicker';

describe('app-home', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home');
    expect(element).toHaveClass('hydrated');
  });

  it('contains a "Profile Page" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home >>> button');
    expect(element.textContent).toEqual('Profile page');
  });
});
