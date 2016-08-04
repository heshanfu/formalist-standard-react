import React, {Component} from 'react'
import classNames from 'classnames'
import debounce from 'lodash.debounce'
import search from './search'
import Pagination from './pagination'
import Spinner from '../spinner'

import styles from './search-selector.mcss'

function abortCurrentSearch (req) {
  if (req && req.abort) {
    req.abort()
  }
}

class SearchSelector extends Component {
  constructor (props) {
    super(props)

    // Instance vars
    this.page = 1
    this.query = null
    // Persistent request object
    this.currentRequest = null

    // Default state
    this.state = {
      loading: false,
      results: [],
      pagination: {},
    }

    // Bindings
    this.doSearch = debounce(this.doSearch.bind(this), 250)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSuccess = this.onSearchSuccess.bind(this)
    this.goToPage = this.goToPage.bind(this)
  }

  componentWillMount () {
    const {threshold} = this.props
    // Do a search for nothing on load if threshold is 0
    if (threshold === 0) {
      this.doSearch('')
    }
  }

  componentWillUnmount () {
    abortCurrentSearch(this.currentRequest)
  }

  doSearch (query) {
    const {
      params,
      perPage,
      threshold,
      url,
    } = this.props
    this.query = (query != null) ? query : this.query
    // Abort any existing requests
    abortCurrentSearch(this.currentRequest)

    // Only search if have enough characters
    if (this.query.length >= threshold) {
      // Save the current request
      const data = Object.assign({}, params, {
        q: this.query,
        page: this.page,
        per_page: perPage,
      })
      const req = search(url, data)
      req.response
        .then(this.onSearchSuccess)
      this.currentRequest = req

      this.setState({
        loading: true,
      })
    } else {
      this.setState({
        loading: false,
        results: [],
        pagination: {}
      })
    }
  }

  onSearchChange (e) {
    const query = e.target.value
    // Reset page value to default
    this.page = 1
    this.doSearch(query)
  }

  onSearchSuccess (rsp) {
    this.setState({
      loading: false,
      results: rsp.results,
      pagination: rsp.pagination,
    })
  }

  goToPage (page) {
    this.page = parseInt(page)
    this.doSearch()
  }

  focusSearch () {
    this._search.focus()
  }

  render () {
    const {onSelection, optionComponent} = this.props
    const {loading, results, pagination} = this.state

    // Has query?
    const hasQuery = (this.query != null && this.query !== '')

    // Render each option
    const Option = optionComponent
    const options = results.map((option) => {
      let onClick = function (e) {
        e.preventDefault()
        onSelection(option.id, option)
      }.bind(this)
      return (
        <button
          key={option.id}
          className={styles.optionButton}
          onClick={onClick}>
          <Option option={option} />
        </button>
      )
    })

    const resultClassNames = classNames(
      styles.results,
      {
        [`${styles.resultsLoading}`]: loading,
      }
    )

    return (
      <div className={styles.base}>
        <input
          ref={(r) => this._search = r}
          type='text'
          className={styles.search}
          placeholder='Type to search'
          onChange={this.onSearchChange} />
        {
          (loading) ? <Spinner className={styles.spinner}/> : null
        }
        {
          (options.length > 0)
          ? <div className={resultClassNames}>
              <div className={styles.pagination}>
                <Pagination currentPage={this.page} totalPages={pagination.total_pages} goToPage={this.goToPage}/>
              </div>
              <div className={styles.list}>
                {options}
              </div>
            </div>
          : (hasQuery && !loading) ? <p className={styles.noResults}>No results matching your search</p> : null
        }
      </div>
    )
  }
}

/**
 * Default props
 * @type {Object}
 */
SearchSelector.defaultProps = {
  optionComponent: ({option}) => (
    <div>
      {option.label}
    </div>
  ),
  selectedIds: [],
  perPage: 20,
  threshold: 1,
}

/**
 * PropTypes
 * @type {Object}
 */
SearchSelector.propTypes = {
  onSelection: React.PropTypes.func.isRequired,
  optionComponent: React.PropTypes.func,
  selectedIds: React.PropTypes.array,
  params: React.PropTypes.object,
  perPage: React.PropTypes.number,
  threshold: React.PropTypes.number,
  url: React.PropTypes.string.isRequired,
}

export default SearchSelector
