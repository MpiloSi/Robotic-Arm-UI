'use client'

import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const socket = io('http://localhost:5000')

export default function Page() {
  const [isSorting, setIsSorting] = useState(false)
  const [metrics, setMetrics] = useState({
    objectsSorted: 0,
    accuracy: 0,
    sortingRate: 0
  })

  useEffect(() => {
    socket.on('sortingStatus', (data) => setIsSorting(data.isSorting))
    socket.on('performanceUpdate', setMetrics)

    return () => {
      socket.off('sortingStatus')
      socket.off('performanceUpdate')
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
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <p>Live camera feed placeholder</p>
            </div>
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
              <p className="text-2xl">{metrics.objectsSorted}</p>
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
    </div>
  )
}