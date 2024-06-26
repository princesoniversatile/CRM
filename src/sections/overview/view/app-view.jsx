import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

const api = import.meta.env.VITE_API;

const AppView = () => {
  const [customers, setCustomers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${api}/customers`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        created_date: new Date(item.created_date)
      }));
      setCustomers(formattedData);
      incrementTotalDataCount();
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${api}/offers`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      setOffers(data);
      incrementTotalDataCount();
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${api}/leads`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data);
      incrementTotalDataCount();
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${api}/complaints`);
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      setComplaints(data);
      incrementTotalDataCount();
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const incrementTotalDataCount = () => {
    setTotalDataCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCustomers();
      await fetchOffers();
      await fetchComplaints();
      await fetchLeads();
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (totalDataCount === 3) {
      setLoading(false);
    }
  }, [totalDataCount]);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  const calculateMonthlyCustomerAdditions = () => {
    const monthData = {};
    customers.forEach((customer) => {
      const createdDate = new Date(customer.created_date);
      const monthYear = `${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;

      monthData[monthYear] = (monthData[monthYear] || 0) + 1;

    });

    return monthData;
  };

  const monthlyCustomerData = calculateMonthlyCustomerAdditions();

  const calculatePercentageIncrease = (current, previous) => {
    if (previous === 0) return 'N/A';
    return ((current - previous) / previous) * 100;
  };

  const currentYear = new Date().getFullYear();
  const currentYearCustomersCount = customers.filter(
    customer => new Date(customer.created_date).getFullYear() === currentYear
  ).length;
  const previousYearCustomersCount = customers.filter(
    customer => new Date(customer.created_date).getFullYear() === currentYear - 1
  ).length;

  const percentageIncrease = calculatePercentageIncrease(
    currentYearCustomersCount,
    previousYearCustomersCount
  );

  const calculateMonthlyAdditions = (data, key) => {
    const monthData = {};
    data.forEach((item) => {
      const createdDate = new Date(item.created_date);
      const monthYear = `${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;

      monthData[monthYear] = (monthData[monthYear] || 0) + 1;
    });

    return Object.keys(monthData).map((month) => ({
      label: month,
      value: monthData[month],
    }));
  };

  const calculateMonthlyAdditionsLeads = (data, key) => {
    const monthData = {};
    data.forEach((item) => {
      const createdDate = new Date(item.follow_up);
      const monthYear = `${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;

      monthData[monthYear] = (monthData[monthYear] || 0) + 1;
    });

    return Object.keys(monthData).map((month) => ({
      label: month,
      value: monthData[month],
    }));
  };

  const calculateMonthlyAdditionsOffers = (data, key) => {
    const monthData = {};
    data.forEach((item) => {
      const createdDate = new Date(item.start_date);
      const monthYear = `${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;

      monthData[monthYear] = (monthData[monthYear] || 0) + 1;
    });

    return Object.keys(monthData).map((month) => ({
      label: month,
      value: monthData[month],
    }));
  };

  const calculateMonthlyAdditionsComplain = (data, key) => {
    const monthData = {};
    data.forEach((item) => {
      const createdDate = new Date(item.complaint_date);
      const monthYear = `${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;

      monthData[monthYear] = (monthData[monthYear] || 0) + 1;
    });

    return Object.keys(monthData).map((month) => ({
      label: month,
      value: monthData[month],
    }));
  };

  const monthlyCustomersData = calculateMonthlyAdditions(customers, 'Customers');
  const monthlyLeadsData = calculateMonthlyAdditionsLeads(leads, 'Leads');
  const monthlyComplaintsData = calculateMonthlyAdditionsComplain(complaints, 'Bug Reports');
  const monthlyOffersData = calculateMonthlyAdditionsOffers(offers, 'Offers');

  const labels = monthlyCustomersData.map((item) => item.label);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Offers"
            total={offers.length}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={customers.length}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Leads"
            total={leads.length}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bug Reports"
            total={complaints.length}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Customer, Leads, Bug Reports, Offers Data"
            subheader="Monthly Additions"
            chart={{
              labels,
              series: [
                {
                  name: 'Customers',
                  type: 'column',
                  fill: 'gradient',
                  data: monthlyCustomersData.map((item) => item.value),
                },
                {
                  name: 'Leads',
                  type: 'area',
                  fill: 'gradient',
                  data: monthlyLeadsData.map((item) => item.value),
                },
                {
                  name: 'Bug Reports',
                  type: 'area',
                  fill: 'gradient',
                  data: monthlyComplaintsData.map((item) => item.value),
                },
                {
                  name: 'Offers',
                  type: 'area',
                  fill: 'gradient',
                  data: monthlyOffersData.map((item) => item.value),
                },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Customers"
            chart={{
              series: Object.keys(monthlyCustomerData).map((key) => ({
                label: key,
                value: monthlyCustomerData[key],
              })),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppConversionRates
            title='Recent Customers from Different States'
            subheader={`(${+percentageIncrease > 0 ? '+' : ''}${percentageIncrease.toFixed(
              2
            )}%) than last year`}
            chart={{
              series: customers.reduce((acc, customer) => {
                const { state } = customer;
                const existingState = acc.find(item => item.label === state);

                if (existingState) {
                  existingState.value += 1;
                } else {
                  acc.push({ label: state, value: 1 });
                }

                return acc;
              }, []),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppView;