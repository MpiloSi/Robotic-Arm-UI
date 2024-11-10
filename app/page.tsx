'use client'

import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const socket = io('http://localhost:5000')

export default function Page() {
  const [isSorting, setIsSorting] = useState(false)
  const [metrics, setMetrics] = useState({
    objectsSorted: {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0
    },
    accuracy: 0,
    sortingRate: 0
  })
  const [ultrasonicData, setUltrasonicData] = useState({
    front: 0,
    left: 0,
    right: 0
  })

  useEffect(() => {
    socket.on('sortingStatus', (data) => setIsSorting(data.isSorting))
    socket.on('performanceUpdate', setMetrics)
    socket.on('ultrasonicData', setUltrasonicData)

    return () => {
      socket.off('sortingStatus')
      socket.off('performanceUpdate')
      socket.off('ultrasonicData')
    }
  }, [])

  const handleStart = async () => {
    const response = await fetch('http://localhost:5000/start', { method: 'POST' })
    if (response.ok) setIsSorting(true)
  }

  const handleStop = async () => {
    const response = await fetch('http://localhost:5000/stop', { method: 'POST' })
    if (response.ok) setIsSorting(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Robotic Sorting Arm Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Camera Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src="http://localhost:5001/video_feed" 
              alt="Live object detection feed"
              className="w-full h-auto"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={handleStart} disabled={isSorting}>
                Start Sorting
              </Button>
              <Button onClick={handleStop} disabled={!isSorting} variant="destructive">
                Stop Sorting
              </Button>
            </div>
            <p className="mt-4">Status: {isSorting ? 'Sorting' : 'Idle'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Objects Sorted</h3>
              <ul>
                
                <li>Red: {metrics.objectsSorted.red}</li>
                <li>Blue: {metrics.objectsSorted.blue}</li>
                <li>Green: {metrics.objectsSorted.green}</li>
                <li>Yellow: {metrics.objectsSorted.yellow}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Accuracy</h3>
              <p className="text-2xl">{metrics.accuracy.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="font-semibold">Sorting Rate</h3>
              <p className="text-2xl">{metrics.sortingRate.toFixed(2)} objects/min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ultrasonic Sensor Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Front Distance</h3>
              <p className="text-2xl">{ultrasonicData.front.toFixed(2)} cm</p>
            </div>
            <div>
              <h3 className="font-semibold">Left Distance</h3>
              <p className="text-2xl">{ultrasonicData.left.toFixed(2)} cm</p>
            </div>
            <div>
              <h3 className="font-semibold">Right Distance</h3>
              <p className="text-2xl">{ultrasonicData.right.toFixed(2)} cm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}