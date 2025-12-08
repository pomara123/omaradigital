---
title: DMTA Request System – Cross-Functional Experiment Request Workflow
description: A centralized, end-to-end workflow system that streamlines request intake, routing, experiment execution, and result tracking across the full DMTA lifecycle.
publishDate: 'Jan 10 2024'
isFeatured: true
seo:
  image:
    src: '../../assets/images/dmta.png'
---

![Project preview](../../assets/images/dmta.png)

**Project Overview:**
The DMTA Request System is a comprehensive workflow platform designed to orchestrate the full Design–Make–Test–Analyze lifecycle across Product Development, Manufacturing, and dozens of scientific testing teams. It centralizes experiment request intake, automates routing, ensures traceability, and integrates deeply with the organization’s LIMS and downstream systems to provide a transparent and audit-ready workflow for all stakeholders.

## Objectives

1. Build a unified system to intake, route, and manage experiment requests across all DMTA stages.
2. Integrate directly with the new Core LIMS to pull authoritative sample data and synchronize results back into legacy systems, including ERP and the company website.
3. Improve traceability, accountability, and governance across cross-functional workflows involving hundreds of scientists.
4. Replace the outdated legacy process with a flexible, extensible system that supports evolving scientific and operational requirements.

## Background

Scientific teams required a centralized and transparent process to manage experiment requests and track progress across the DMTA workflow. Product Development and Manufacturing groups submitted testing requests, dozens of upstream teams generated samples and documentation, and numerous testing teams executed experiments. Coordinating this multi-team flow demanded a streamlined system that consolidated data and ensured consistent communication.

## Problem

The legacy request system was disconnected from the new LIMS platform, making it difficult to access critical sample data. Its rigid workflows could not support new process requirements, lacked end-to-end visibility, and created operational inefficiencies. The organization needed a more flexible, data-aware solution with improved traceability, governance, and integration capabilities.

## Features

1. **Integrated Sample Data Access**
   - Pulls authoritative sample information directly from the new Core LIMS.
   - Synchronizes experiment results back to legacy systems for downstream needs.

2. **End-to-End Request Workflow**
   - Supports request intake, routing, experiment tracking, and completion notifications.
   - Includes clear approvals, handoffs, and audit trails.

3. **Cross-Functional Collaboration**
   - Aligns Product Development, Manufacturing, and testing groups with consistent workflows.
   - Improves transparency into request progress and bottlenecks.

4. **Governance & Data Integrity Controls**
   - Standardized workflows enforce data quality, required fields, and structured approvals.
   - Clearly defined ownership and accountability across teams.

5. **Downstream System Integration**
   - Pushes validated data to ERP, reporting systems, and customer-facing website content.
   - Ensures accurate and timely information for internal and external stakeholders.

## Technology Stack

- Request System: Jira (yes, we used Jira as an DMTA request tool)
- LIMS: Core LIMS  
- Integrations: Boomi  
- Backend / Logic: Java, JavaScript, SQL  
- Database: Oracle  
- Supporting Systems: ERP, website CMS  

## Outcome

The DMTA Request System improved the daily workflows of more than 300 scientists, enabling faster request processing, improved visibility, and fully traceable experiment tracking. Organization-wide, it ensured consistent and reliable data flow to downstream systems, strengthening reporting, customer-facing materials, and decision-making across scientific and operational teams.