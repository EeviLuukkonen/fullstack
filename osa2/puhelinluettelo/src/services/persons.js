import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const remove = (url) => {
    return axios.delete(url)
}

const put = (url, changedObject) => {
    return axios.put(url, changedObject)
}

export default { getAll, create, remove, put }