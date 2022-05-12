import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import commonStyles from './App.module.less';
import styles from './Country.module.less';
import { selectTheme } from './stores/ThemeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectREST, selectIsEmptyCountryList, getCountryByCode } from './stores/RESTSlice';
import { getAllCountries, getCountry } from './stores/RESTSaga';

const CountryContent = ({ content, store }: any) => {
  const Theme = useSelector(selectTheme);
  const {
    name,
    population,
    region,
    capital,
    flags,
    subregion,
    tld,
    currencies,
    languages,
    borders
  } = content;
  const langs = Object.keys(languages);
  const lang = langs.find((lang) => name.nativeName);

  return (<>
    <div>
      <Link to="/" className={commonStyles.link}>
        <div className={`${styles.back} ${styles.button} ${commonStyles[Theme + '-element']}`}>
          <svg className={`${commonStyles.icon} ${commonStyles['icon-' + Theme]}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <use href="/src/icons.svg#back"></use>
          </svg>
          Back
        </div>
      </Link>
    </div>
    <div className={`${styles.description} ${styles[Theme + '-text']}`}>
      <div className={styles['flag-container']}>
        <img className={styles.flag} src={flags.svg} />
      </div>
      <div className={styles.info}>
        {name?.official &&
          <h2 className={styles.name}>
            {name.official}
          </h2>
        }
        <div className={styles.columns}>
          <div className={styles.column}>
            <div><b>Native Name:</b> {name.nativeName[lang!].official}</div>
            <div><b>Population:</b> {population}</div>
            <div><b>Region:</b> {region} </div>
            {subregion && <div><b>Sub Region:</b> {subregion}</div>}
            {capital && <div><b>Capital:</b> {capital}</div>}
          </div>
          <div className={styles.column}>
            <div><b>Top Level Domain:</b> {tld}</div>
            <div><b>Currencies:</b> {Object.values(currencies).map(({ name }: any) => name).join(', ')}</div>
            <div><b>Languages:</b> {Object.values(languages).join(', ')}</div>
          </div>
        </div>
        {
          store.allCountries &&
          borders &&
          <div className={styles.borders}>
            <b>Border Countries:</b>
            {
              borders
                  .map((key: string) => getCountryByCode(store, key))
                  .filter((obj: object) => obj)
                .map(({ cca3, name }: any) =>
                  <Link key={cca3} to={'/' + cca3} className={`${commonStyles.link} ${styles.border}`}>
                    <div className={`${styles.button} ${commonStyles[Theme + '-element']}`}>
                      {name.official}
                    </div>
                  </Link>
                )
            }
          </div>
        }
      </div>
    </div>
  </>);
};

const Country = () => {
  const store = useSelector(selectREST);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!store.allCountries.length) {
      dispatch(getAllCountries());
    }
  }, [])

  const isSetCountry = store.countryList[0] && store.countryList[0].cca3 === id && store.countryList.length === 1;

  useEffect(() => {
    if (store.isLoading || isSetCountry) {
      return;
    }
    dispatch(getCountry(id));
  }, [store.isLoading, id, isSetCountry]);

  const isNotExistCountry = store.allCountries.length && !getCountryByCode(store, id);

  useEffect(() => {
    if (isNotExistCountry) {
      navigate('/');
    }
  }, [isNotExistCountry]);

  return (
    <section className={styles.content}>
      {store.isLoading
        ? <div> Loading... </div>
        : isSetCountry
          ? <CountryContent content={store.countryList[0]} store={store} />
          : null}
    </section>
  );
};

export default Country;
