import commonStyles from './App.module.less';
import styles from './Countries.module.less';
import Select, { SingleValue } from 'react-select';
import RESTStore from './stores/RESTStore';
import { observer } from "mobx-react-lite"
import { ReactEventHandler, SyntheticEvent, useCallback, useContext, useEffect } from 'react';
import debounce from 'debounce';
import RESTContext from './RESTContext';
import { Link } from 'react-router-dom';
import Theme from './stores/ThemeStore';

const options = [
  { value: 'Africa', label: 'Africa' },
  { value: 'America', label: 'America' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Oceania', label: 'Oceania' }
];

/*
background-color: hsl(0, 0%, 100%);
  color: hsl(200, 15%, 8%);
  box-shadow: 0px 0px 8px 0px hsl(0deg 0% 90%);
*/
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    // none of react-select's styles are passed to <Control />
    width: 170,
    height: 57,
    marginBottom: '3rem',
    color: Theme.toString() === 'light' ? 'black' : 'white',
    backgroundColor: Theme.toString() === 'light' ? 'white' : 'hsl(209, 23%, 22%)',
    boxShadow: Theme.toString() === 'light' ? '0px 0px 8px 0px hsl(0deg 0% 90%)' : '0px 0px 8px 0px hsl(0deg 0% 10%)',

  }),
  menu: (provided: any) => ({
    ...provided,

    color: Theme.toString() === 'light' ? 'black' : 'white',
    backgroundColor: Theme.toString() === 'light' ? 'white' : 'hsl(209, 23%, 22%)',
  })
  ,
  singleValue: (provided: any) => ({
    ...provided,

    color: Theme.toString() === 'light' ? 'black' : 'white',
    backgroundColor: Theme.toString() === 'light' ? 'white' : 'hsl(209, 23%, 22%)',
  })
}

const Countries = observer(() => {
  const store = useContext<RESTStore>(RESTContext);

  const onChangeRegion = useCallback(({ value }: SingleValue<{ value: string, label: string }>) => {
    store.region = value;
  }, [store]);

  const onChangeSearch: ReactEventHandler = useCallback(
    debounce(({ target }: SyntheticEvent) => {
      store.search = (target as HTMLInputElement).value;
    }, 300)
    , [store]);

  useEffect(() => {
    if (store.isEmptyCountryList) {
      store.getAllCountries()
        .then(store.setCountryList)
    }
  }, [store.isEmptyCountryList, store]);

  return (<>
    <section className={commonStyles.filter}>
      <div className={commonStyles['search-container']}>
        <svg className={`${commonStyles.icon} ${commonStyles['icon-search']} ${commonStyles['icon-' + Theme]}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <use href="/src/icons.svg#search"></use>
        </svg>
        <input onChange={onChangeSearch} className={`${commonStyles.search} ${commonStyles[Theme + '-element']}`} placeholder='Search for a country...'></input>
      </div>

      <Select
        className={`${styles[Theme + '-element']}`}
        placeholder="Filter by Region"
        options={options}
        styles={customStyles}
        onChange={onChangeRegion} />
    </section>
    <section className={styles.countries}>
      {store.error
        ? <div>Something gone wrong</div>
        : (store.isLoading
          ? <div>Loading...</div>
          : store.countryList.map(({ name, population, region, capital, flags, cca3 }: any) =>
            <Link className={commonStyles.link} key={cca3} to={cca3}>
              <div className={`${styles.country} ${commonStyles[Theme + '-element']}`}>
                <div className={styles['flag-container']}>
                  <img loading="lazy" className={styles.flag} src={flags.png} />
                </div>
                <div className={styles['country-info']}>
                  <h4 className={styles['country-name']}>{name.official}</h4>
                  <div>Population: {population}</div>
                  <div>Region: {region}</div>
                  {capital && <div>Capital: {capital}</div>}
                </div>
              </div>
            </Link>
          ))
      }
    </section>
  </>);
});

export default Countries;
