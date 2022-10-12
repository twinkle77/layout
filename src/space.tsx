import { createElement, useContext, FC, useMemo } from 'react';
import classNames from 'classnames';
import { isNumber } from 'lodash-es';
import Context from '@/common/context';
import { isPresetSize, wrapUnit } from '@/utils';
import { LayoutContextProps, SpaceProps } from '@/types';

/**
 * 间距
 */
const Space: FC<SpaceProps> = (props) => {
  const { className, size, direction, children, style, ...others } = props;
  const { prefix } = useContext<LayoutContextProps>(Context);
  const clsPrefix = `${prefix}space`;
  const isVertical = direction === 'ver';

  const spaceCls = classNames(clsPrefix, {
    [`${clsPrefix}--${size}`]: isPresetSize(size as string),
    [`${clsPrefix}--${direction}`]: true,
  });

  const newStyle = useMemo(
    () => ({
      ...style,
      ...(isNumber(size) && direction === 'hoz' ? { height: wrapUnit(size) } : null),
      ...(isNumber(size) && direction === 'ver' ? { width: wrapUnit(size) } : null),
    }),
    [size, direction],
  );

  return createElement(
    isVertical ? 'span' : 'div',
    {
      ...others,
      className: spaceCls,
      style: newStyle,
    },
    children,
  );
};

Space.displayName = 'Space';
Space.defaultProps = {
  size: 'medium',
  direction: 'hoz',
};

export default Space;