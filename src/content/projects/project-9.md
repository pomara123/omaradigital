---
title: GMP-Compliant Antibody Formulation System
description: Developed a GMP-compliant antibody formulation system with full material tracking, container lineage, and automated formulation calculations, integrating cross-functional teams and LIMS data models.
publishDate: 'Dec 11 2025'
isFeatured: true
order: 70
seo:
  image:
    src: '../../assets/images/antibody_formulation.png'
---

![Project preview](../../assets/images/antibody_formulation.png)

**Project Overview:**  
This project involved implementing a GMP-compliant antibody formulation system to ensure complete traceability of raw materials, intermediates, and final products. Each batch and container was uniquely barcoded, enabling full container lineage and material tracking. Custom JavaScript/HTML/CSS forms were embedded directly into the LIMS system, automatically identifying the user and tracking all actions in audit logs. Users scanned and entered material amounts, ensuring accurate and compliant formulation execution. The system was designed in collaboration with buffer prep, antibody manufacturing, and other cross-functional teams.

## Objectives

1. Ensure full GMP-compliant tracking of raw materials, intermediates, and finished products.
2. Enable container-level traceability through unique barcoding.
3. Automate formulation calculations to reduce human error and improve efficiency.
4. Provide visibility into container movements and material usage.
5. Collaborate with multiple groups to align processes and data models.
6. Maintain audit-ready records with automatic user tracking.

## Background

The organization required a robust system to manage antibody formulation processes under GMP standards. Raw materials needed to be registered, and any material produced onsite required tracking. Manual processes were prone to error and lacked traceability, increasing regulatory risk.

## Problem

Manual tracking of materials and formulations made it difficult to ensure compliance and traceability. Mistakes in calculations or container assignments could compromise batch integrity. There was also limited visibility into where materials and containers were located at any given time. Additionally, user actions were not automatically tracked, making audits more cumbersome.

## Features

1. **Cross-Functional Collaboration**
   - Worked extensively with buffer prep, antibody manufacturing, and other groups to capture process requirements.
   - Ensured the system aligned with real-world workflows.

2. **Material Registration & Tracking**
   - Raw materials registered and tracked throughout the formulation process.
   - Onsite-produced materials tracked with the same rigor.

3. **Barcode-Based Container Lineage**
   - Each container (tubes, bottles, etc.) assigned a unique barcode.
   - Full lineage tracked, showing parent-child relationships and container movements.

4. **Custom Form-Based Workflow Embedded in LIMS**
   - Forms embedded directly into the LIMS system, automatically knowing the user.
   - Calculated required material amounts for each batch.
   - Actions tracked in audit logs to ensure GMP compliance.

5. **LIMS Data Model for Components**
   - Designed the data model to track all “components,” i.e., how much of each container was added to each formulation.
   - Enabled detailed reporting and audit-ready records.

6. **GMP Compliance Support**
   - Ensures all processes meet regulatory standards.
   - Provides auditable records for internal and external reviews.

## Technology Stack

- Forms & Workflow: Custom JavaScript/HTML/CSS embedded in Core LIMS
- LIMS: Core LIMS
- Barcode System: Linear/2D barcode scanners and Zebra printers

## Outcome

The system enabled full GMP-compliant tracking of antibody formulations, improved operational efficiency, and reduced human error. It provided real-time visibility into materials and containers, automated formulation calculations, and created a complete audit trail. Embedded LIMS forms automatically tracked user actions, simplifying audits. Collaboration with multiple groups ensured the system aligned with actual workflows, enhancing compliance and operational confidence.
