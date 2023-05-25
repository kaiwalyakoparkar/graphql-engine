import { StoryObj, Meta } from '@storybook/react';
import { ReactQueryDecorator } from '../../../../../storybook/decorators/react-query';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { ReduxDecorator } from '../../../../../storybook/decorators/redux-decorator';

import {
  RemoteSchemaToDbForm,
  RemoteSchemaToDbFormProps,
} from './RemoteSchemaToDBForm';

import { handlers } from '../../__mocks__';

export default {
  title: 'Features/Remote Relationships/Components/Remote Schema To Db Form',
  component: RemoteSchemaToDbForm,
  decorators: [
    ReactQueryDecorator(),
    ReduxDecorator({ tables: { currentDataSource: 'default' } }),
  ],
  parameters: {
    msw: handlers(),
  },
} as Meta;

export const Primary: StoryObj<RemoteSchemaToDbFormProps> = {
  args: {
    sourceRemoteSchema: 'source_remote_schema',
    closeHandler: () => {},
  },
};

export const PrimaryWithTest: StoryObj<RemoteSchemaToDbFormProps> = {
  args: Primary.args,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const submitButton = (await canvas.findAllByText('Add Relationship'))[1];

    userEvent.click(submitButton);

    const nameError = await canvas.findByText('Name is required!');
    const dbError = await canvas.findByText('Database is required!');
    const typeError = await canvas.findByText('Type is required!');

    // expect error messages
    expect(nameError).toBeInTheDocument();
    expect(dbError).toBeInTheDocument();
    expect(typeError).toBeInTheDocument();

    // update fields
    const nameInput = await canvas.findByLabelText('Name');
    userEvent.type(nameInput, 'test');

    const dbLabel = await canvas.findByLabelText('Reference Database');
    const schemaLabel = await canvas.findByLabelText('Reference Schema');
    const tableLabel = await canvas.findByLabelText('Reference Table');
    const typeLabel = await canvas.findByLabelText('Source Type');

    userEvent.selectOptions(dbLabel, 'chinook');
    userEvent.selectOptions(schemaLabel, 'public');
    userEvent.selectOptions(tableLabel, 'Album');
    userEvent.selectOptions(typeLabel, 'Language');
    userEvent.click(submitButton);
  },
};

export const WithExistingRelationship: StoryObj<RemoteSchemaToDbFormProps> = {
  args: {
    ...Primary.args,
    sourceRemoteSchema: 'with_default_values',
    typeName: 'Country',
    existingRelationshipName: 'testRemoteRelationship',
  },
};
