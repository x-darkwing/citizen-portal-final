# Highly Available Kubernetes Architecture

## Control Plane Nodes
- **Quantity:** 3
- **Role:** Manage cluster state, schedule pods, respond to cluster events. Three nodes guarantee quorum and eliminate the control plane as a single point of failure.
- **Components:** kube-apiserver, kube-scheduler, kube-controller-manager.

## etcd
- **Type:** Embedded
- **Configuration:** Runs locally on the 3 control plane nodes. 
- **High Availability:** Uses Raft consensus algorithm which tolerates the loss of a single control plane node.

## Worker Nodes
- **Quantity:** 2 (Minimum)
- **Role:** Host the application workloads (Frontend, Backend, Database, Redis).
- **Redundancy:** Applications are deployed with multiple replicas distributed across the worker nodes using Pod Anti-Affinity rules to ensure that a failure of one worker node does not disrupt the application availability.

## Load Balancer
- **External Load Balancer:** An external high availability load balancer distributes incoming user traffic across worker nodes running the Ingress Controllers.
- **Ingress Controller:** NGINX or similar ingress controller runs as a DaemonSet or Deployment with replicas scaled to multiple worker nodes.

## High Availability PostgreSQL
- **Architecture:** Primary-Replica setup. 
- **Failover:** Automatic failover configured via tools like Patroni or repmgr.
- **Components:** 
  - 1 Primary pod (Read/Write)
  - N Replica pods (Read-Only)
  - PgBouncer or similar for connection pooling.

## Application Workloads
- **Frontend & Backend API:** Minimum of 2 replicas with PodAntiAffinity to ensure pods are scheduled on separate nodes.
- **PodDisruptionBudgets (PDB):** Ensures a minimum number of pods are available during voluntary disruptions.
