import React, { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import AppCurrentVisits from '../app-current-visits'
import AppWebsiteVisits from '../app-website-visits'
import AppWidgetSummary from '../app-widget-summary'
import AppConversionRates from '../app-conversion-rates' // Import CountUp library

const api = import.meta.env.VITE_API

const AppView = () => {
  const [customers, setCustomers] = useState([])
  const [offers, setOffers] = useState([])
  const [leads, setLeads] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true) // State to manage loading
  const [totalDataCount, setTotalDataCount] = useState(0) // Total data count

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${api}/customers`)
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      const data = await response.json()
      setCustomers(data)
      incrementTotalDataCount()
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${api}/offers`)
      if (!response.ok) {
        throw new Error('Failed to fetch offers')
      }
      const data = await response.json()
      setOffers(data)
      incrementTotalDataCount()
    } catch (error) {
      console.error('Error fetching offers:', error)
    }
  }

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${api}/complaints`)
      if (!response.ok) {
        throw new Error('Failed to fetch complaints')
      }
      const data = await response.json()
      setComplaints(data)
      incrementTotalDataCount()
    } catch (error) {
      console.error('Error fetching complaints:', error)
    }
  }
  const fetchLeads = async () => {
    try {
      const response = await fetch(`${api}/leads`)
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      const data = await response.json()
      setLeads(data)
      incrementTotalDataCount()
    } catch (error) {
      console.error('Error fetching complaints:', error)
    }
  }

  const incrementTotalDataCount = () => {
    setTotalDataCount(prevCount => prevCount + 1)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCustomers()
      await fetchOffers()
      await fetchComplaints()
      await fetchLeads()
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once on component mount

  useEffect(() => {
    if (totalDataCount === 3) {
      setLoading(false) // Update loading state
    }
  }, [totalDataCount])

  if (loading) {
    // Placeholder or loading state
    return (
      <Container maxWidth='xl'>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Loading...
        </Typography>
      </Container>
    )
  }

  // Function to calculate monthly customer additions
  const calculateMonthlyCustomerAdditions = () => {
    const monthData = {}
    customers.forEach(customer => {
      const createdDate = new Date(customer.created_date)
      const monthYear = `${createdDate.toLocaleString('default', {
        month: 'long',
      })} ${createdDate.getFullYear()}`

      if (monthData[monthYear]) {
        // eslint-disable-next-line no-plusplus
        monthData[monthYear]++
      } else {
        monthData[monthYear] = 1
      }
    })

    return monthData
  }

  // Get the monthly customer additions data
  const monthlyCustomerData = calculateMonthlyCustomerAdditions()

  // const calculatePercentageIncrease = (current, previous) => {
  //   if (previous === 0) return 'N/A';
  //   return ((current - previous) / previous) * 100;
  // };

  const calculatePercentageIncrease = (current, previous) => {
    if (previous === 0) return 'N/A'
    return ((current - previous) / previous) * 100
  }

  // Filter customers based on current year and previous year
  const currentYear = new Date().getFullYear()
  const currentYearCustomersCount = customers.filter(
    customer => new Date(customer.created_date).getFullYear() === currentYear
  ).length
  const previousYearCustomersCount = customers.filter(
    customer => new Date(customer.created_date).getFullYear() === currentYear - 1
  ).length

  const percentageIncrease = calculatePercentageIncrease(
    currentYearCustomersCount,
    previousYearCustomersCount
  )

  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='Offers'
            total={offers.length}
            color='success'
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_bag.png' />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='New Users'
            total={customers.length}
            color='info'
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_users.png' />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='Leads'
            total={leads.length}
            color='warning'
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_buy.png' />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='Bug Reports'
            total={complaints.length}
            color='error'
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_message.png' />}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title='Customer Increase Data'
            subheader='(+43%) than last year'
            chart={{
              labels: [
                '05/01/2023',
                '06/01/2023',
                '07/01/2023',
                '08/01/2023',
                '09/01/2023',
                '10/01/2023',
                '11/01/2023',
                '12/01/2023',
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
              ],
              series: [
                {
                  name: 'New Customers',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30], // Replace with actual data
                },
                {
                  name: 'Returning Customers',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43], // Replace with actual data
                },
                {
                  name: 'VIP Customers',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39], // Replace with actual data
                },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title='Current Customers'
            chart={{
              series: Object.keys(monthlyCustomerData).map(key => ({
                label: key,
                value: monthlyCustomerData[key],
              })),
            }}
          />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Type Of Leads"
            subheader="(+113%) than last year"
            chart={{
              series: [
                { label: 'Marketing Campaigns', value: 20 }, // Replace with actual data
                { label: 'Website Traffic', value: 25 }, // Replace with actual data
                { label: 'Email Marketing', value: 18 }, // Replace with actual data
                { label: 'Social Media', value: 15 }, // Replace with actual data
                { label: 'Referral Programs', value: 30 }, // Replace with actual data
                { label: 'Direct Sales', value: 35 }, // Replace with actual data
                { label: 'Partnerships', value: 40 }, // Replace with actual data
                { label: 'Events', value: 50 }, // Replace with actual data
                { label: 'Online Advertising', value: 60 }, // Replace with actual data
                { label: 'Content Marketing', value: 70 }, // Replace with actual data
              ],
            }}
          />
        </Grid> */}
        <Grid item xs={12} md={6} lg={8}>
          <AppConversionRates
            title='Recent Customers from Different States'
            subheader={`(${+percentageIncrease > 0 ? '+' : ''}${percentageIncrease.toFixed(
              2
            )}%) than last year`}
            chart={{
              series: customers.reduce((acc, customer) => {
                const { state } = customer
                const existingState = acc.find(item => item.label === state)

                if (existingState) {
                  existingState.value += 1
                } else {
                  acc.push({ label: state, value: 1 })
                }

                return acc
              }, []),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default AppView
