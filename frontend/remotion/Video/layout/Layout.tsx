import React from 'react';
import { LayoutComponentMap, LayoutType } from '../utils/mappings';
import { LayoutOne } from './LayoutOne';
import { LayoutTwo } from './LayoutTwo';
import { LayoutThree } from './LayoutThree';
import { LayoutFour } from './LayoutFour';
import { LayoutFive } from './LayoutFive';
import { LayoutSix } from './LayoutSix';
import type { z } from 'zod';
import type { CompositionProps } from '../../../types/constants';

type Props = z.infer<typeof CompositionProps>;

export const Layout: React.FC<Props> = (props) => {
  const LayoutComponent = LayoutComponentMap[props.arrangement];
  
  if (!LayoutComponent) {
    console.warn(`Layout type ${props.arrangement} not found, falling back to default layout`);
    return <LayoutOne {...props} />;
  }
  
  return <LayoutComponent {...props} />;
};