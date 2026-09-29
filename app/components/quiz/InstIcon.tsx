import React from 'react';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/instagram';

type Props = React.ComponentProps<typeof SocialIcon>;

export const InstagramLink: React.FC<Props> = ({
  network = 'instagram',
  target = '_blank',
  rel = 'noopener noreferrer',
  'aria-label': ariaLabel = 'Instagram',
  ...rest
}) => (
  <SocialIcon network={network} target={target} rel={rel} aria-label={ariaLabel} {...rest} />
);

export default InstagramLink;
