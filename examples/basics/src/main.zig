const std = @import("std");
const Io = std.Io;

const basics = @import("basics");

pub fn main(_: std.process.Init) !void {
    try integer();
}

pub fn integer() !void {
    const age: i32 = 12;
    var cost: i64 = 15;
    if (cost >= 20) {
        cost = 20;
    } else {
        cost = 0;
    }
    std.debug.print("Age: {}, Cost: {} ", .{ age, cost });
}

fn might_fail(flag: bool) !u32 {
    if (flag) return 42;
    return error.Failed;
}

test "if as expressions" {
    const maybe: ?u32 = 42;

    if (maybe) |value| {
        try std.testing.expectEqual(42, value);
    } else {
        // Maybe was null
        try std.testing.expectEqual(null, maybe);
    }

    if (might_fail(false)) |value| {
        try std.testing.expectEqual(42, value);
    } else |err| {
        std.debug.print("ERROR: {}", .{err});
    }
}
