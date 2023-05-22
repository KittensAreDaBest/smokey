/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useRef, useState, Fragment, use, useEffect } from 'react'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import fs from 'fs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
interface Props {
  data: Config
}
export default function Home(props: Props) {
  const [location, setLocation] = useState<string>(props.data.locations[0].locations[0].api)
  const [selectedLocation, setSelectedLocation] = useState<LocationChild>(props.data.locations[0].locations[0])
  const [type, setType] = useState<string>(`${selectedLocation.pingtrace ? 'ping' : selectedLocation.bgp ? 'bgp' : null}`)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [data, setData] = useState<string>("")
  const [error, setError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    props.data.locations.forEach((lcl) => {
      lcl.locations.forEach((lcl) => {
        if (lcl.api === location) {
          setSelectedLocation(lcl)
          setType(`${lcl.pingtrace ? 'ping' : lcl.bgp ? 'bgp' : null}`)
          setDisabled(false)
          setData("")
          setError("")
        }
      })
    })
  }, [location, props.data.locations])
  useEffect(() => {
    console.log(selectedLocation)
  }, [selectedLocation])
  const submit = () => {
    setError("")
    setData("")
    setDisabled(true)
    axios.post(`${location}/lg`, {
      target: inputRef && inputRef.current ? inputRef.current.value : "",
      type
    }).then((res) => {
      setData(res.data.data)
    }).catch((err) => {
      try {
        setError(err.response.data.error)
      } catch (e) {
        setError(err.toString())
      }
      console.log(error)
    }).finally(() => {
      setDisabled(false)
    })
  }
  return (
    <>
      <Head>
        <title>{`${props.data.company.name} - Looking Glass`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className='container mx-auto gap-4 px-4 2xl:px-0 flex flex-col'>
        <div className='flex md:flex-row flex-col items-center md:justify-between gap-4 w-full justify-center py-8'>
          <div className='flex flex-row gap-4 items-center'>
            <div className='h-12 w-40 flex justify-center items-center'>
              <img src={props.data.company.logo} alt={`logo of ${props.data.company.name}`} />
            </div>
            <div className='h-full w-[1px] bg-gray-300 min-h-[30px] sm:block hidden' />
            <span className='text-2xl font-semibold sm:block hidden'>Looking Glass</span>
          </div>
          <div className="w-full md:w-[180px] h-full flex items-center">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {props.data.locations.map((location, index) => (
                  <SelectGroup key={location.name}>
                    <SelectLabel>{location.name}</SelectLabel>
                    {location.locations.map((location, index) => (
                      <SelectItem key={location.name} value={location.api}>{location.name}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border bg-card'>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>Test IPv4</span>
            <code>{selectedLocation.ipv4.length === 0 ? "Not set" : selectedLocation.ipv4}</code>
          </div>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>Test IPv6</span>
            <code>{selectedLocation.ipv6.length === 0 ? "Not set" : selectedLocation.ipv6}</code>
          </div>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>Location</span>
            <code>{selectedLocation.location.length === 0 ? "Not set" : selectedLocation.location}</code>
          </div>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>Datacenter</span>
            <code>{selectedLocation.datacenter.length === 0 ? "Not set" : selectedLocation.datacenter}</code>
          </div>
        </div>
        {selectedLocation.filesUrl.length > 0 && (
          <div className='rounded-md flex flex-col gap-4 border p-3  bg-card'>
            <span className='text-lg'>Test Files</span>
            <div className='md:grid-cols-2 lg:grid-cols-4 grid gap-4'>
              <a href={`${selectedLocation.filesUrl}/files/100M.file`} target='_blank' className='w-full'>
                <Button variant="outline" className='w-full'>100M Test File</Button>
              </a>
              <a href={`${selectedLocation.filesUrl}/files/100M.file`} target='_blank' className='w-full'>
                <Button variant="outline" className='w-full'>1GB Test File</Button>
              </a>
              <a href={`${selectedLocation.filesUrl}/files/100M.file`} target='_blank' className='w-full'>
                <Button variant="outline" className='w-full'>5GB Test File</Button>
              </a>
              <a href={`${selectedLocation.filesUrl}/files/100M.file`} target='_blank' className='w-full'>
                <Button variant="outline" className='w-full'>10GB Test File</Button>
              </a>
            </div>
          </div>
        )}


        <div className='rounded-md p-3 gap-4 flex flex-col border bg-card'>
          <span className='text-lg'>Looking Glass</span>
          <div className='flex flex-col md:flex-row gap-4'>
            <Input className='flex-1' placeholder={`Enter a ${type == "bgp" ? "IP" : "IP or Hostname"}`} disabled={disabled} ref={inputRef} />
            <Select value={type} onValueChange={setType} disabled={disabled}>
              <SelectTrigger className='w-auto min-w-[180px]'>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedLocation.pingtrace && (
                    <>
                      <SelectItem value="ping">Ping</SelectItem>
                      <SelectItem value="mtr">MTR</SelectItem>
                      <SelectItem value="traceroute">Traceroute</SelectItem>
                    </>
                  )}
                  {selectedLocation.bgp && (
                    <SelectItem value="bgp">BGP Route Trace</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button disabled={disabled} onClick={submit}>Run</Button>
          </div>
        </div>
        {error.length > 0 && (
          <Alert className='border-red-500'>
            <AlertTitle>An error occured</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        {data.length > 0 && (
          <div className='rounded-md p-3 gap-4 flex flex-col border bg-card'>
            <span className='text-lg'>Results</span>
            <div className='flex flex-col p-3 bg-black rounded-md overflow-auto'>
              {data.split("\n").map((line, i) => (
                <>
                  {line === "" ? <br /> : <pre key={i} className='term'>{line}</pre>}
                </>
              ))}
            </div>
          </div>
        )}
        <div className='flex flex-row items-center w-full justify-start gap-4 py-4'>
          <a href="https://github.com/kittensaredabest/smokey" target={"_blank"} rel="noreferrer" className='inline-flex flex-row items-center gap-2 text-gray-500'>
            Powered by Smokey
          </a>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const data: Config = JSON.parse(fs.readFileSync('public/config.json').toString());
  return {
    props: {
      data
    }
  }
}