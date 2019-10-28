import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  CellMeasurer,
  List,
  InfiniteLoader,
  AutoSizer
} from "react-virtualized";
import {
  MeasuredCellParent,
  CellMeasurerCache
} from "react-virtualized/dist/es/CellMeasurer";

// Styles
import classes from "./styles.scss";

/**
 *
 *
 * @param hasNextPage hasNextPage Are there more items to load?
 * @param isNextPageLoading Are we currently loading a page of items?
 * @param items Array of items loaded so far.
 * @param loadNextPage Callback function responsible for loading the next page of items.
 */
interface SimpleWindowWrapperProps {
  reset: boolean;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: JSX.Element[];
  loadNextPage: (params: {
    startIndex: number;
    stopIndex: number;
  }) => Promise<any>;
}

function SimpleWindowWrapper(
  props: SimpleWindowWrapperProps,
  ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const { reset, hasNextPage, isNextPageLoading, items, loadNextPage } = props;
  const cache = useRef(
    new CellMeasurerCache({ defaultHeight: 10, fixedWidth: true })
  );
  const list = useRef<List>();

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = useCallback(
    isNextPageLoading ? async (): Promise<any> => {} : loadNextPage,
    [isNextPageLoading, loadNextPage]
  );

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = useCallback(
    (params: { index: number }): boolean =>
      !hasNextPage || params.index < items.length,
    [hasNextPage, items]
  );

  // Render an item or a loading indicator.
  const rowRenderer = useCallback(
    (props: {
      index: number;
      isScrolling: boolean;
      key: string;
      parent: MeasuredCellParent;
      style: React.CSSProperties;
    }): JSX.Element => {
      const { index, isScrolling, key, parent, style } = props;
      let content;
      if (!isRowLoaded({ index })) {
        content = "Loading...";
      } else {
        content = items[index];
      }
      return (
        <CellMeasurer
          cache={cache.current}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
          width={0}
        >
          <div style={style}>{content}</div>
        </CellMeasurer>
      );
    },
    [isRowLoaded, items]
  );

  const setListRef = useCallback(
    (registerChild: any) => (listRef: any): void => {
      list.current = listRef;
      registerChild(listRef);
    },
    []
  );

  useEffect(() => {
    const index = items.length - 1;
    cache.current.clear(index, 0);
    if (list.current) {
      list.current.recomputeRowHeights(index);
    }
  }, [items]);

  useEffect(() => {
    if (reset) {
      cache.current.clearAll();
      if (list.current) {
        list.current.recomputeRowHeights();
      }
    }
  }, [reset]);

  const timeoutId = useRef<NodeJS.Timeout>();

  function handleResize(): void {
    console.log("resizing");
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout((): void => {
      cache.current.clearAll();
      if (list.current) {
        list.current.recomputeRowHeights();
      }
    }, 50);
  }

  return (
    <AutoSizer onResize={handleResize}>
      {({ height, width }): JSX.Element => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={items.length + 1}
        >
          {({ onRowsRendered, registerChild }): JSX.Element => (
            <div className={classes["list-wrapper"]} ref={ref}>
              <List
                deferredMeasurementCache={cache.current}
                height={height}
                onRowsRendered={onRowsRendered}
                overscanRowCount={0}
                ref={setListRef(registerChild)}
                rowCount={items.length + 1}
                rowHeight={cache.current.rowHeight}
                rowRenderer={rowRenderer}
                width={width}
              />
            </div>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}

export default React.forwardRef<HTMLDivElement, SimpleWindowWrapperProps>(
  SimpleWindowWrapper
);
