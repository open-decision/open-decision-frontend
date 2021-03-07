import { Field, FieldProps } from "components";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Primitives/FormElements/Field",
  component: Field,
  args: { label: "E-Mail", name: "email" },
  argTypes: {
    onChange: { action: "changed" },
    containerClasses: { control: { disable: true } },
    labelClasses: { control: { disable: true } },
    inputClasses: { control: { disable: true } },
  },
} as Meta;

const FieldTemplate: Story<FieldProps> = (args) => <Field {...args} />;

export const Block = FieldTemplate.bind({});

export const Inline = FieldTemplate.bind({});
Inline.args = {
  variant: "inline",
};
