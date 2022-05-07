import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RESTContext from './RESTContext';
import RESTStore from './stores/RESTStore';
import commonStyles from './App.module.less';
import styles from './Country.module.less';
import Theme from './stores/ThemeStore';

const CountryContent = observer(({ content, store }: any) => {
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
                .map((key: string) => store.getCountryByCode(key))
                .filter((obj: object) => obj.hasOwnProperty('cca3'))
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
});

const Country = observer(() => {
  const store = useContext<RESTStore>(RESTContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (store.isLoading) {
      return;
    }
    store.country = id;
  }, [store.isLoading, id]);

  useEffect(() => {
    if (store.isEmptyCountryList) {
      navigate('/');
      store.country = '';
    }
  }, [store.isEmptyCountryList]);

  return (
    <section className={styles.content}>
      {store.isLoading
        ? <div> Loading... </div>
        : store.countryList.length
          ? <CountryContent content={store.countryList[0]} store={store} />
          : null}
    </section>
  );
})

export default Country;
