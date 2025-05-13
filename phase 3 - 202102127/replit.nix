{ pkgs }: {
  deps = [ pkgs.php pkgs.phpPackages.pdo_mysql pkgs.mysql ];
}