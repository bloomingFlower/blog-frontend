import React from 'react';
import { Helmet } from 'react-helmet-async';
import manifest from '../manifest.json';

const DefaultTitle = () => (
    <Helmet>
        <title>{manifest.name}</title>
        <meta name="description" content={manifest.description} />
        <meta name="theme-color" content={manifest.theme_color} />
        <meta name="background-color" content={manifest.background_color} />
        <meta name="application-name" content={manifest.short_name} />
        <link rel="icon" href={manifest.icons[0].src} sizes={manifest.icons[0].sizes} type={manifest.icons[0].type} />
        <link rel="apple-touch-icon" href={manifest.icons[1].src} />
        <meta name="apple-mobile-web-app-title" content={manifest.short_name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
);

export default DefaultTitle;