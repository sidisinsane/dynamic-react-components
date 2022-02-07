import React from 'react';

import { blockComponentsList, BlockComponentKey } from './BlockComponentsList';

/**
 * Types for data/data-blocks.json
 */
interface DataBlockProps {
  _uid: string;
  component: string;
  components?: DataBlockProps[];
}

const RenderBlock = (block: DataBlockProps) => {
  const BlockComponent = blockComponentsList[block.component as BlockComponentKey];

  // component does exist
  if (BlockComponent) {
    return React.createElement(BlockComponent, {
      key: block._uid,
      block: block as any,
      RenderBlock,
      // @ts-ignore
    }, block.children);
  }
  // component doesn't exist yet
  return React.createElement(
    () => (
      <div className="message message--unavailable">
        <div>The component <samp>{block.component}</samp> has not been created yet.</div>
      </div>
    ),
    { key: block._uid }
  );
}

export default RenderBlock;

// export default (block: DataBlockProps) => {
//   const BlockComponent = blockComponentsList[block.component as BlockComponentKey];
//
//   // component does exist
//   if (BlockComponent) {
//     return React.createElement(BlockComponent, {
//       key: block._uid,
//       block: block as any,
//     });
//   }
//   // component doesn't exist yet
//   return React.createElement(
//     () => (
//       <div className="message message--unavailable">
//         <div>The component <samp>{block.component}</samp> has not been created yet.</div>
//       </div>
//     ),
//     { key: block._uid }
//   );
// }
