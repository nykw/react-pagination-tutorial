/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { OnPageChanged } from '../App';

const range = (from: number, to: number, step = 1): number[] => {
  let i = from;
  const range: number[] = [];

  while (i <= to) {
    range.push(i++);
  }

  return range;
};

type Props = {
  totalRecords: number;
  pageLimit?: number;
  pageNeighbours?: number;
  onPageChanged?: OnPageChanged;
};

const Pagination: FC<Props> = ({
  totalRecords = 0,
  pageLimit = 30,
  pageNeighbours = 0,
  onPageChanged = () => undefined,
}) => {
  const [totalPages] = useState(Math.ceil(totalRecords / pageLimit));
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * ページャーに利用する数字(または記号)を求める
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
  const fetchPageNumbers = (): (number | 'LEFT' | 'RIGHT')[] => {
    /** ページャーに表示する数字の数 */
    const totalNumbers = pageNeighbours * 2 + 3;
    /** <, > を含めたブロックの数 */
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages: (number | 'LEFT' | 'RIGHT')[] = range(startPage, endPage);

      /** 左側に消えるページを持つか */
      const hasLeftSpill = startPage > 2;
      /** 右側に消えるページを持つか */
      const hasRightSpill = totalPages - endPage > 1;
      /** 左右から消えるページの数 */
      const spillOffset = totalNumbers - (pages.length + 1);

      // pagesの決定
      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = ['LEFT', ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, 'RIGHT'];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = ['LEFT', ...pages, 'RIGHT'];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    // totalPages <= totalBlocksのとき
    return range(1, totalPages);
  };

  const pages = fetchPageNumbers();

  const gotoPage = useCallback(
    (page: number) => {
      const currentPage = Math.max(0, Math.min(page, totalPages));
      setCurrentPage(currentPage);
    },
    [totalPages],
  );

  const handleClick = (page: number): MouseEventHandler<HTMLAnchorElement> => (evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  useEffect(() => {
    onPageChanged({
      currentPage,
      totalPages,
      pageLimit,
      totalRecords,
    });
  }, [currentPage, onPageChanged, pageLimit, totalPages, totalRecords]);

  return (
    <>
      <nav aria-label="Countries Pagination">
        <ul className="pagination">
          {pages.map((page, index) => {
            if (page === 'LEFT')
              return (
                <li key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Previous" onClick={handleMoveLeft}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );

            if (page === 'RIGHT')
              return (
                <li key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Next" onClick={handleMoveRight}>
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );

            return (
              <li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
                <a className="page-link" href="#" onClick={handleClick(page)}>
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
