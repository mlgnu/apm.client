import { forwardRef, useContext, useEffect, useState } from "react";
import {
  IconChevronRight,
  IconExternalLink,
  IconUser,
} from "@tabler/icons-react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  rem,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import { IconTrash, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { UserContext, useUserContext } from "../utils/UserContext";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { Profile } from "../pages/Profile/Profile";
import { logout } from "../data/auth";
import { useQueryClient } from "@tanstack/react-query";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        color: "var(--mantine-color-text)",
        borderRadius: "var(--mantine-radius-sm)",
      }}
      {...others}
    >
      <Group>
        <IconUserCircle size={30} />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronRight size="1rem" />}
      </Group>
    </UnstyledButton>
  ),
);

type UserProps = {
  email: string;
  name: string;
  role: number;
};

export function User({ email, name, role }: UserProps) {
  const user = useUserContext();
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  if (!user)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );
  return (
    <>
      <Menu withArrow>
        <Menu.Target>
          <UserButton name={name} email={email} />
        </Menu.Target>
        <Menu.Dropdown>
          {(role === 0 || role === 1) && (
            <Menu.Item
              leftSection={
                <IconUser style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => {
                open();
              }}
            >
              Profile
            </Menu.Item>
          )}

          <Menu.Item
            onClick={() => {
              modals.openConfirmModal({
                title: "Logout",
                centered: true,
                children: (
                  <Text size="sm">
                    Are you sure you want to logout from your account
                  </Text>
                ),
                labels: {
                  confirm: "Logout",
                  cancel: "Stay logged in, I've changed my mind",
                },
                confirmProps: { color: "red" },
                onCancel: () => console.log("Cancel"),
                onConfirm: () => {
                  logout();
                  queryClient.invalidateQueries({ queryKey: ["user"] });
                  // window.location.href = "/";
                },
              });
            }}
            // component="a"
            // href="http://localhost:3001/api/auth/google/logout"
            color="red"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        size="auto"
        centered
        opened={opened}
        onClose={close}
        withCloseButton={false}
      >
        <Profile role={role} close={close} />
      </Modal>
    </>
  );
}
