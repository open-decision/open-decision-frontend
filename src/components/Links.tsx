import clsx from "clsx";
import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

type CommonLinkProps = {
  /**
   * Styles the link tag.
   */
  className?: string;
};

type InternalLinkProps = CommonLinkProps & RouterLinkProps;

const InternalLink: React.FC<InternalLinkProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <RouterLink
      className={clsx(className, "no-underline text-base")}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonLinkProps;

const ExternalLink: React.FC<ExternalLinkProps> = ({
  children,
  className,
  ...props
}) => (
  <a className={clsx(className, "no-underline text-base")} {...props}>
    {children}
  </a>
);

const hasHref = (
  props: InternalLinkProps | ExternalLinkProps
): props is ExternalLinkProps => "href" in props;

export type LinkProps = InternalLinkProps | ExternalLinkProps;

/**
 * Should be used as a replacement for `a` tags and react router links. Renders the right element depending on the `href` or `to` prop.
 */
export const Link: React.FC<LinkProps> = (props) => {
  if (hasHref(props)) return <ExternalLink {...props} />;

  return <InternalLink {...props} />;
};
