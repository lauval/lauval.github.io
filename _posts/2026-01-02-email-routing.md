---
layout: post
title: THE 100% FREE EMAIL SETUP THAT WE USE AT OCEAN AI
date: 2026-01-02 21:44:00+0400
description: A visualization of our email routing infrastructure using Cloudflare and Resend.
tags: email-routing cloudflare resend free
categories: documentation
mermaid:
  enabled: true
  zoomable: true
---

This marks my very first post on my very own, freshly-built website that I somehow put together thanks to the generosity of the the greatest collection of humans out there - the open source community. 

We're going to dive right in.
This is a practical 'tutorial'? (it isn't really, it's just a collection of thoughts I had as I went through the process for my team's email setup). 
The only caveat is that it isn't exactly 100% free. We (OCEAN AI) are early-career professionals so we're not exactly swimming in cash, but we *can* afford to buy a domain (in our case @ocean-ai-sey.com). So the only pre-requisite if you're trying to follow along is ownership of a domain. I've always used Cloudflare registrar to purchase mine just because they're a reputable company and there are security benefits you get on the free plan. There have been no issues, to date, but I'm also not outwardly endorsing Cloudflare. So not only would I recommend buying your own domain but I'd also recommend doing your research and weighing your options. There are loads of other providers to choose from, each with their own perks and pros and cons. 

So without further ado:

## THE PROBLEM STATEMENT
Following a conversation with someone who'd been around the NGO/Blue Economy/Climat Change for a while, I was inspired to reach out to embassies to enquire about funding opportunities in STEM and AI since that's what we're all about at OCEAN AI. But then I thought it would look so much more professional if we were sending emails from a custom domain. My reasoning was that an org looking to disburse funds would feel more at ease entrusting us with their money if we'd at least gone through the effort of presenting ourselves professionally. The only problem is that we didn't have a domain at the time and I didn't want to ask members to pay even 5 dollars out of pocket for Google Workspace, which would have easily covered several needs at once, including cloud storage, real-time collaboration, custom email addresses, etc. So the biggest constraint here is money. We had to do it for free. Luckily, that's entirely possible thanks to Resend and Cloudflare.

## THE SOLUTION
It works like this:

When an email sent to your custom email address e.g. "enquiries@ocean-ai-sey.com" is routed (forwarded) by Cloudflare to your personal email account. 

You might then type a response through your normal email client (by client I'm referring to the app, the software you use to write and send your email e.g. gmail, outlook, etc.) Once you hit send, Resend handles the delivery of your email FROM your custom address.

So then you reply from enquiries@ocean-ai-sey.com rather than islander123@gmail.com.

Et voilà! Free email routing to and from your personal email address, through Cloudflare (incoming) and Resend (outgoing) that makes you look like an absolute pro.

The image below is called a mermaid diagram and it illustrates the process as described above.

```mermaid
flowchart TD
    classDef cloudflare fill:#F6821F,stroke:#333,stroke-width:2px,color:#fff
    classDef resend fill:#000,stroke:#333,stroke-width:2px,color:#fff
    classDef gmail fill:#EA4335,stroke:#333,stroke-width:2px,color:#fff
    classDef user fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    classDef external fill:#34A853,stroke:#333,stroke-width:2px,color:#fff

    %% Nodes
    EXT[External Sender]:::external
    CF[Cloudflare Email Routing<br/>DNS + Forwarding]:::cloudflare
    GMAIL[Gmail Interface<br/>Read & Compose]:::gmail
    RESEND[Resend SMTP<br/>smtp.resend.com:587]:::resend
    TEAM[Team Member<br/>@your-domain-name.com]:::user
    RECIPIENT[External Recipient]:::external

    %% Incoming Email Flow
    EXT -->|1. Sends to team@your-domain-name.com| CF
    CF -->|2. Forwards to personal Gmail| GMAIL
    GMAIL -->|3. Team member reads email| TEAM

    %% Outgoing Email Flow
    TEAM -->|4. Composes from team@your-domain-name.com| GMAIL
    GMAIL -->|5. SMTP Auth API Key| RESEND
    RESEND -->|6. Delivers email| RECIPIENT

    %% DNS Records
    DNS[DNS Records]:::cloudflare
    CF -.->|Manages| DNS
    RESEND -.->|Validates against| DNS
```

## THE METHOD
This is a no-code solution.
It's all clicks and tweaking settings.
But we'll be skipping some of the mundane setup instructions such as how to sign up to Cloudflare, how to buy a domain from their registrar service, and how to sign up to Resend. Everything else is covered below.

### CLOUDFLARE
1. Once you own the domain, you'll see it pop up in your dashboard. Click on it.