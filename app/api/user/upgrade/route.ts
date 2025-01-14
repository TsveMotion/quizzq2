

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPGRADE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
