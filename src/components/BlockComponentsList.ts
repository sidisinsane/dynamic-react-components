import Bar from './blocks/Bar';
import Foo from './blocks/Foo';
import Header from './blocks/Header';

import Copy from './typographic/Copy';
import Headline from './typographic/Headline';

const blockComponentsList = {
  foo: Foo,
  bar: Bar,
  header: Header,
  copy: Copy,
  headline: Headline,
};

type BlockComponentsListType = typeof blockComponentsList;
type BlockComponentKey = keyof BlockComponentsListType;

export {
  blockComponentsList,
  BlockComponentKey
}
