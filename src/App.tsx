import React, { FC, useCallback, useEffect, useState } from 'react';
import './App.css';
// import Country from 'countries-api';
import CountryCard, { Country } from './components/CountryCard';
import Pagination from './components/Pagination';

// TODO: 型定義ファイルの作成
const Countries = require('countries-api');

export type OnPageChanged = ({
  currentPage,
  totalPages,
  pageLimit,
  totalRecords,
}: {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}) => void;

const App: FC = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [currentCountries, setCurrentCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const onPageChanged: OnPageChanged = useCallback(
    ({ currentPage, totalPages, pageLimit }) => {
      const offset = (currentPage - 1) * pageLimit;
      const currentCountries = allCountries.slice(offset, offset + pageLimit);

      setCurrentPage(currentPage);
      setCurrentCountries(currentCountries);
      setTotalPages(totalPages);
    },
    [allCountries],
  );

  useEffect(() => {
    const { data: allCountries = [] } = Countries.findAll();
    setAllCountries(allCountries);
  }, []);

  const totalCountries = allCountries.length;

  if (totalCountries === 0) return null;

  const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : '']
    .join(' ')
    .trim();

  return (
    <div className="container mb-5">
      <div className="row d-flex flex-row py-5">
        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <h2 className={headerClass}>
              <strong className="text-secondary">{totalCountries}</strong> Countries
            </h2>
            {currentPage && (
              <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                Page <span className="font-weight-bold">{currentPage}</span> /{' '}
                <span className="font-weight-bold">{totalPages}</span>
              </span>
            )}
          </div>
          <div className="d-flex flex-row py-4 align-items-center">
            <Pagination
              totalRecords={totalCountries}
              pageLimit={18}
              pageNeighbours={1}
              onPageChanged={onPageChanged}
            />
          </div>
        </div>
        {currentCountries.map((country) => (
          <CountryCard key={country.cca2} country={country} />
        ))}
      </div>
    </div>
  );
};

export default App;
