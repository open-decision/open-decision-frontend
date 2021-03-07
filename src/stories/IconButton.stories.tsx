import { IconButton, IconButtonProps } from "components";
import { ChartPieOutline } from "@graywolfai/react-heroicons";
import { Meta, Story } from "@storybook/react";

export default {
  title: "Primitives/Buttons/IconButton",
  component: IconButton,
  argTypes: { onClick: { action: "clicked" } },
} as Meta;

const IconButtonTemplate: Story<IconButtonProps> = (args) => (
  <IconButton {...args}>
    <ChartPieOutline className="w-8" />
  </IconButton>
);

export const Default = IconButtonTemplate.bind({});
