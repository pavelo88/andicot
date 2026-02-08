"use client"
import { useState, useEffect } from "react"
import { doc, onSnapshot, collection } from "firebase/firestore"
import { db } from "@/lib/firebase" // <--- Importante que esto coincida
import { webData as defaultData, servicesData as defaultServices } from "@/lib/data"

export function useSystemData() {
  const [data, setData] = useState(defaultData)
  const [services, setServices] = useState(defaultServices)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Escuchar la configuración general
    const unsubscribeConfig = onSnapshot(doc(db, "configuracion", "web_data"), (doc) => {
      if (doc.exists()) setData(prev => ({ ...prev, ...doc.data() }))
      setLoading(false)
    })

    // 2. Escuchar los servicios
    const unsubscribeServices = onSnapshot(collection(db, "servicios"), (snapshot) => {
      const servicesList: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      if (servicesList.length > 0) setServices(servicesList)
    })

    return () => { unsubscribeConfig(); unsubscribeServices() }
  }, [])

  return { data, services, loading }
}
