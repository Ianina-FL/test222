import * as icon from '@mdi/js';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import BaseIcon from '../components/BaseIcon';
import { getPageTitle } from '../config';
import Link from 'next/link';

import { hasPermission } from '../helpers/userPermissions';
import { fetchWidgets } from '../stores/roles/rolesSlice';
import { WidgetCreator } from '../components/WidgetCreator/WidgetCreator';
import { SmartWidget } from '../components/SmartWidget/SmartWidget';

import { useAppDispatch, useAppSelector } from '../stores/hooks';
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const corners = useAppSelector((state) => state.style.corners);
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);

  const [users, setUsers] = React.useState('Loading...');
  const [categories, setCategories] = React.useState('Loading...');
  const [coffee_blends, setCoffee_blends] = React.useState('Loading...');
  const [customers, setCustomers] = React.useState('Loading...');
  const [orders, setOrders] = React.useState('Loading...');
  const [payments, setPayments] = React.useState('Loading...');
  const [reports, setReports] = React.useState('Loading...');
  const [roles, setRoles] = React.useState('Loading...');
  const [permissions, setPermissions] = React.useState('Loading...');
  const [category, setCategory] = React.useState('Loading...');

  const [widgetsRole, setWidgetsRole] = React.useState({
    role: { value: '', label: '' },
  });
  const { currentUser } = useAppSelector((state) => state.auth);
  const { isFetchingQuery } = useAppSelector((state) => state.openAi);

  const { rolesWidgets, loading } = useAppSelector((state) => state.roles);

  async function loadData() {
    const entities = [
      'users',
      'categories',
      'coffee_blends',
      'customers',
      'orders',
      'payments',
      'reports',
      'roles',
      'permissions',
      'category',
    ];
    const fns = [
      setUsers,
      setCategories,
      setCoffee_blends,
      setCustomers,
      setOrders,
      setPayments,
      setReports,
      setRoles,
      setPermissions,
      setCategory,
    ];

    const requests = entities.map((entity, index) => {
      if (hasPermission(currentUser, `READ_${entity.toUpperCase()}`)) {
        return axios.get(`/${entity.toLowerCase()}/count`);
      } else {
        fns[index](null);
        return Promise.resolve({ data: { count: null } });
      }
    });

    Promise.allSettled(requests).then((results) => {
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          fns[i](result.value.data.count);
        } else {
          fns[i](result.reason.message);
        }
      });
    });
  }

  async function getWidgets(roleId) {
    await dispatch(fetchWidgets(roleId));
  }
  React.useEffect(() => {
    if (!currentUser) return;
    loadData().then();
    setWidgetsRole({
      role: {
        value: currentUser?.app_role?.id,
        label: currentUser?.app_role?.name,
      },
    });
  }, [currentUser]);

  React.useEffect(() => {
    if (!currentUser || !widgetsRole?.role?.value) return;
    getWidgets(widgetsRole?.role?.value || '').then();
  }, [widgetsRole?.role?.value]);

  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={icon.mdiChartTimelineVariant}
          title='Overview'
          main
        >
          {''}
        </SectionTitleLineWithButton>

        {!!rolesWidgets.length && <hr className='my-6  ' />}

        <div
          id='dashboard'
          className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'
        >
          {hasPermission(currentUser, 'READ_USERS') && (
            <Link href={'/users/users-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Users
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {users}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiAccountGroup || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_CATEGORIES') && (
            <Link href={'/categories/categories-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Categories
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {categories}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiTag || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_COFFEE_BLENDS') && (
            <Link href={'/coffee_blends/coffee_blends-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Coffee blends
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {coffee_blends}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiCoffee || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_CUSTOMERS') && (
            <Link href={'/customers/customers-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Customers
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {customers}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiAccountCircle || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_ORDERS') && (
            <Link href={'/orders/orders-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Orders
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {orders}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiPackageVariantClosed || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_PAYMENTS') && (
            <Link href={'/payments/payments-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Payments
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {payments}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiCreditCard || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_REPORTS') && (
            <Link href={'/reports/reports-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Reports
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {reports}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiChartLine || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_ROLES') && (
            <Link href={'/roles/roles-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Roles
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {roles}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={
                        icon.mdiShieldAccountVariantOutline || icon.mdiTable
                      }
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_PERMISSIONS') && (
            <Link href={'/permissions/permissions-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Permissions
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {permissions}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiShieldAccountOutline || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_CATEGORY') && (
            <Link href={'/category/category-list'}>
              <div
                className={`${
                  corners !== 'rounded-full' ? corners : 'rounded-3xl'
                } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
              >
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                      Category
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {category}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className={`${iconsColor}`}
                      w='w-16'
                      h='h-16'
                      size={48}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      path={icon.mdiTable || icon.mdiTable}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </SectionMain>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Dashboard;
