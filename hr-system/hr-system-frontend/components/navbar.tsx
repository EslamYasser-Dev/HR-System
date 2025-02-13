"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, DiscordIcon, SearchIcon, Logo } from "@/components/icons";
import { navbarItems } from "@/config/navbar";
import { LoginDialog } from "@/components/loginDialog";

export const Navbar = () => {
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInState = localStorage.getItem("isLoggedIn") === "true";

    setLoggedIn(loggedInState);
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
              <p className="font-bold text-inherit">HR System</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {isLoggedIn
              ? navbarItems.map((item) => (
                  <NavbarItem key={item.href}>
                    <NextLink
                      className="text-base text-default-500 hover:text-primary"
                      href={item.href}
                    >
                      {item.label}
                    </NextLink>
                  </NavbarItem>
                ))
              : null}{" "}
            {/* No 'Login to view' message */}
          </ul>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <Link
              isExternal
              aria-label="Linkedin"
              href={siteConfig.links.linkedin}
            >
              <DiscordIcon className="text-default-500" />
            </Link>
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

          {!isLoggedIn && (
            <Button
              className="text-sm font-normal text-default-600 bg-default-100"
              variant="bordered"
              onPress={() => setLoginDialogOpen(true)}
            >
              Register New
            </Button>
          )}

          <NavbarItem className="hidden md:flex">
            {isLoggedIn ? (
              <Button
                className="text-sm font-normal text-default-600 bg-default-100"
                onPress={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                className="text-sm font-normal text-default-600 bg-default-100"
                onPress={() => setLoginDialogOpen(true)}
              >
                Login
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          {searchInput}
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {isLoggedIn
              ? siteConfig.navMenuItems.map((item, index) => (
                  <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                      color={
                        index === 2
                          ? "primary"
                          : index === siteConfig.navMenuItems.length - 1
                            ? "danger"
                            : "foreground"
                      }
                      href="#"
                      size="lg"
                    >
                      {item.label}
                    </Link>
                  </NavbarMenuItem>
                ))
              : null}{" "}
            {/* No 'Login to view menu' message */}
          </div>
        </NavbarMenu>
      </NextUINavbar>
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLoginSuccess={() => handleLoginSuccess()}
      />
    </>
  );
};
