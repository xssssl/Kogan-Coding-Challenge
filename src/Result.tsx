import React, { useState, BaseSyntheticEvent, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL, FIRST_API, DESIRED_CATEGORY } from './constants'
import { Size, Parcel } from './types'

const Result: React.FC = (props: any) => {
  const [fetchSuccess, setFetchSuccess] = useState(false)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [log, setLog] = useState('')
  const [averageCubicWeight, setAverageCubicWeight] = useState('')

  useEffect(() => {
    if(fetchSuccess) {
      console.log(`All Desired Parcels Amount: ${parcels.length}`)
      const parcelsCubicWeight = parcels.map(parcel => calculateCubicWeight(parcel.size))
      const averageCubicWeight = (
        parcelsCubicWeight.reduce((accumulator, current) => accumulator + current) / parcelsCubicWeight.length)
      setAverageCubicWeight(averageCubicWeight.toString() + ' kg')
      console.log(`Parcels Cubic Weight: ${parcelsCubicWeight}`)
      console.log(`Average Cubic Weight: ${averageCubicWeight}`)
    }
  }, [fetchSuccess, parcels])

  const handleOnClick = (event: BaseSyntheticEvent): void => {
    setFetchSuccess(false)
    setParcels([])
    setLog('')
    setAverageCubicWeight('')
    console.log('Button Clicked')
    fetchAPI(BASE_URL + FIRST_API).then(() => setFetchSuccess(true))
  }

  const calculateCubicWeight = ({width, length, height}: Size, factor:number = 250): number => {
    return width * length * height / 1000000 * factor
  }

  const fetchAPI = async (url: string): Promise<string> => {
    const response = await axios.get(url)
    const { objects, next } = response.data
    const filteredObjects = objects.filter((obj: Parcel) => obj.category.toLowerCase() === DESIRED_CATEGORY)
    setParcels((prevState) => {
      return prevState.concat(filteredObjects)
    })
    setLog((prevState) => prevState + '\nFetching: ' + url)
    console.log(`Current API: ${url}`)
    if(next) return fetchAPI(BASE_URL + next)
    return next
  }

  return (
    <div>
      <header><h2>Kogan Coding Challenge</h2></header>
      <button
        id="button"
        onClick={(event: BaseSyntheticEvent) => handleOnClick(event)}
      >
        <strong>Calculate</strong>
      </button>
      <pre>{log}</pre>
        <h3>Average Cubic Weight: {averageCubicWeight}</h3>
    </div>
  )
}

export default Result