module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.17"

  cluster_name                   = "${local.project}-${local.environment}-cluster"
  cluster_version                = var.eks_cluster_version
  cluster_endpoint_public_access = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    default_node_group = {
      min_size     = 2
      max_size     = 5
      desired_size = 2

      instance_types = var.eks_node_instance_types
      capacity_type  = "ON_DEMAND"

      # Attach the EBS CSI policy for persistent storage volumes (e.g. PostgreSQL, Redis)
      iam_role_additional_policies = {
        AmazonEBSCSIDriverPolicy = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
      }
    }
  }
}
