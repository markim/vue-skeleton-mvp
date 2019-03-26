import i18n from '@/i18n.js'
import * as types from '@/store/mutation-types'
import { format } from 'date-fns'
const localesDateFns = {
  en: require('date-fns/locale/en'),
  es: require('date-fns/locale/es')
}

export const getFormat = (date, formatStr) => {
  return format(date, formatStr, {
    locale: localesDateFns[window.__localeId__]
  })
}

export const formatErrorMessages = (translationParent, msg) => {
  let errorArray = []
  // Check for error msgs
  if (msg !== null) {
    let json = JSON.parse(JSON.stringify(msg))
    // If error message is an array, then we have mutiple errors
    if (Array.isArray(json)) {
      json.map(error => {
        errorArray.push(i18n.t(`${translationParent}.${error.msg}`))
      })
    } else {
      // Single error
      errorArray.push(i18n.t(`${translationParent}.${msg}`))
    }
    return errorArray
  } else {
    // all good, return null
    return null
  }
}

export const buildPayloadPagination = (pagination, search) => {
  let { sortBy, descending, page, rowsPerPage } = pagination
  // Gets order
  descending = descending ? -1 : 1

  let query = {}

  // If search and fields are defined
  if (search) {
    query = {
      sort: sortBy,
      order: descending,
      page,
      limit: rowsPerPage,
      filter: search.query,
      fields: search.fields
    }
  } else {
    // Pagination with no filters
    query = {
      sort: sortBy,
      order: descending,
      page,
      limit: rowsPerPage
    }
  }
  return query
}

export const handleError = (error, commit, reject) => {
  // Catches error connection or any other error (checks if error.response exists)
  let errMsg = error.response
    ? error.response.data.errors.msg
    : 'SERVER_TIMEOUT_CONNECTION_ERROR'
  commit(types.SHOW_LOADING, false)
  commit(types.ERROR, errMsg)
  reject(error)
}

export const buildSuccess = (
  msg,
  commit,
  resolve,
  resolveParam = undefined
) => {
  commit(types.SHOW_LOADING, false)
  if (msg) {
    commit(types.SUCCESS, msg)
  }
  commit(types.ERROR, null)
  resolve(resolveParam)
}

export const compareVersion = (v1, v2) => {
  if (typeof v1 !== 'string') {
    return false
  }
  if (typeof v2 !== 'string') {
    return false
  }
  v1 = v1.split('.')
  v2 = v2.split('.')
  const k = Math.min(v1.length, v2.length)
  for (let i = 0; i < k; ++i) {
    v1[i] = parseInt(v1[i], 10)
    v2[i] = parseInt(v2[i], 10)
    if (v1[i] > v2[i]) {
      return 1
    }
    if (v1[i] < v2[i]) {
      return -1
    }
  }
  return v1.length === v2.length ? 0 : v1.length < v2.length ? -1 : 1
}
