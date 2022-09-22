/**
 * 段落
 */
import * as React from 'react';
import {
  useContext,
  forwardRef,
  Children,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  isValidElement,
  cloneElement,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import Context from './common/context';
import Text from './text';
import { BaseSize, LayoutContextProps, ParagraphProps, TypeMark } from './types';
import { isString, wrapUnit } from './utils';

const getChildren = (children: any, type: ParagraphProps['type'] = 'body2') => {
  return Children.map(children, (child: ReactNode) => {
    // 文本节点 和 纯文本链接默认使用 Text 节点包裹
    if (typeof child === 'string') {
      return <Text type={type}>{child}</Text>;
    } else if (isValidElement(child)) {
      if (child.type === 'a' && isString(child.props.children)) {
        return cloneElement(
          child,
          { ...child.props },
          <Text type={type} color="inherit">
            {child.props.children}
          </Text>,
        );
        // @ts-ignore
      } else if (child.type._typeMark === 'Text' && !child.props.type) {
        return cloneElement(child, {
          type,
        });
      }
    }

    return child;
  });
};

type IParagraph = ForwardRefExoticComponent<ParagraphProps> & TypeMark;

/**
 * 段落布局，自动为段落内元素增加横向和垂直间隙，并支持多种模式对齐
 */
const P: ForwardRefRenderFunction<HTMLParagraphElement, ParagraphProps> = (props, ref) => {
  const {
    type,
    className,
    beforeMargin,
    afterMargin,
    align,
    verAlign,
    spacing: pspacing,
    verMargin,
    children,
    style,
    ...others
  } = props;
  const { prefix } = useContext<LayoutContextProps>(Context);
  const clsPrefix = `${prefix}p`;
  const newStyle = {
    marginTop: wrapUnit(beforeMargin) || 0,
    marginBottom: wrapUnit(afterMargin) || 0,
    ...style,
  };

  const spacing = pspacing === true ? 'medium' : pspacing;

  return (
    <div
      {...others}
      className={classNames(clsPrefix, className, {
        [`${clsPrefix}-spacing`]: spacing,
        [`${clsPrefix}-align--${align}`]: align,
        [`${clsPrefix}-valign--${verAlign}`]: verAlign,
        [`${clsPrefix}-spacing--${align}`]: spacing && align,
        [`${clsPrefix}-spacing--${spacing}`]:
          ['small', 'medium', 'large'].indexOf(spacing as BaseSize) > -1,
        [`${clsPrefix}-margin`]: verMargin,
        [`${clsPrefix}--${type}`]: type,
      })}
      style={newStyle}
      ref={ref}
    >
      {getChildren(children, type)}
    </div>
  );
};

const RefParagraph: IParagraph = forwardRef(P);

RefParagraph.displayName = 'P';
RefParagraph._typeMark = 'P';

RefParagraph.defaultProps = {
  spacing: 'medium',
  verMargin: true,
  verAlign: 'middle',
};

export default RefParagraph;