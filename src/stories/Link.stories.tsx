import { Link, LinkProps } from "components";
import { Meta, Story } from "@storybook/react";

export default {
  title: "Primitives/Link",
  component: Link,
  argTypes: { href: { control: { disable: true } } },
  args: { children: "Link" },
} as Meta;

const LinkTemplate: Story<LinkProps> = (args) => <Link {...args} />;

export const Default = LinkTemplate.bind({});
Default.args = {
  href: "/",
};
