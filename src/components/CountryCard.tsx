import React, { FC } from 'react';
// import Flag from 'react-flags';
const Flag = require('react-flags');

export type Country = {
  cca2: string;
  region: string;
  name: {
    common: string;
  };
};

type Props = {
  country: Country;
};

const CountryCard: FC<Props> = ({ country }) => {
  const { cca2: code2 = '', region = null, name } = country || {};

  return (
    <div className="col-sm-6 col-md-4 country-card">
      <div className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">
        <div className="h-100 position-relative border-gray border-right px-2 bg-white rounded-left">
          <Flag
            country={code2}
            format="png"
            pngSize={64}
            basePath="./img/flags"
            className="d-block h-100"
          />
        </div>
        <div className="px-3">
          <span className="country-name text-dark d-block font-weight-bold">{name.common}</span>
          <span className="country-region text-secondary text-uppercase">{region}</span>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
