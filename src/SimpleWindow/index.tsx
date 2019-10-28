import React, { useState, useEffect, useCallback, useRef } from "react";

// Locals
import SimpleWindowWrapper from "./SimpleWindowWrapper";

// Styles
import classes from "./styles.scss";

type SimpleWindowState = {
  isNextPageLoading: boolean;
  pageCount: number;
};

interface SimpleWindowProps {
  items: JSX.Element[];
  pageSize?: number;
}

export default function SimpleWindow(props: SimpleWindowProps): JSX.Element {
  const { items, pageSize = 10 } = props;
  const [hasNextPage, setHasNextPage] = useState(false);
  const [state, setState] = useState<SimpleWindowState>({
    isNextPageLoading: true,
    pageCount: 0
  });
  const list = useRef<HTMLDivElement>(null);
  const shownItems = useRef<JSX.Element[]>([]);

  const loadNextPage = useCallback(
    async (params: { startIndex: number; stopIndex: number }): Promise<any> => {
      setState({ ...state, isNextPageLoading: true });
    },
    [state]
  );

  const update = useCallback(() => {
    const startIndex = state.pageCount * pageSize;
    const endIndex =
      startIndex + pageSize < items.length
        ? startIndex + pageSize
        : items.length;
    shownItems.current = [...shownItems.current].concat(
      items.slice(startIndex, endIndex)
    );
    setHasNextPage(shownItems.current.length < items.length);
    setState((prev: SimpleWindowState) => ({
      isNextPageLoading: false,
      pageCount: prev.pageCount + 1
    }));
  }, [items, pageSize, state]);

  useEffect(() => {
    if (state.isNextPageLoading) {
      update();
    }
  }, [update, state]);

  useEffect(() => {
    shownItems.current = [];
    setState({
      isNextPageLoading: true,
      pageCount: 0
    });
  }, [items]);

  return (
    <div className={classes["wrapper"]}>
      <SimpleWindowWrapper
        reset={state.pageCount === 0}
        hasNextPage={hasNextPage}
        isNextPageLoading={state.isNextPageLoading}
        items={shownItems.current}
        loadNextPage={loadNextPage}
        ref={list}
      />
    </div>
  );
}
